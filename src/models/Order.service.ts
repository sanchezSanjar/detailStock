import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { Member } from "../libs/types/member";
import {
  Order,
  OrderInquiry,
  OrderItemInput,
  OrderUpdateInput,
} from "../libs/types/order";
import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/OrderItem.model";
import ProductModel from "../schema/Product.model";
import { OrderStatus } from "../libs/enums/order.enum";
import { ProductStatus } from "../libs/enums/product.enum";
import MemberService from "./Member.service";

// which status a member may move an order to, from its current status
const ALLOWED_STATUS_CHANGES: Partial<Record<OrderStatus, OrderStatus[]>> = {
  [OrderStatus.PAUSE]: [OrderStatus.PROCESS, OrderStatus.DELETE],
  [OrderStatus.PROCESS]: [OrderStatus.FINISH],
};

interface ReservedItem {
  productId: any;
  itemQuantity: number;
  itemPrice: number;
}

class OrderService {
  private readonly orderModel;
  private readonly orderItemModel;
  private readonly productModel;
  private readonly memberService;

  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
    this.productModel = ProductModel;
    this.memberService = new MemberService();
  }

  public async createOrder(
    member: Member,
    input: OrderItemInput[],
  ): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    if (!Array.isArray(input) || input.length === 0) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.EMPTY_ORDER);
    }

    // merge duplicate products and validate quantities
    const quantities = new Map<string, number>();
    for (const item of input) {
      const quantity = Math.floor(Number(item?.itemQuantity));
      if (!Number.isFinite(quantity) || quantity < 1) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
      }
      const productId = String(shapeIntoMongooseObjectId(String(item.productId)));
      quantities.set(productId, (quantities.get(productId) ?? 0) + quantity);
    }

    // prices always come from the database, never from the client
    const products = await this.productModel
      .find({
        _id: { $in: [...quantities.keys()].map((id) => shapeIntoMongooseObjectId(id)) },
        productStatus: ProductStatus.PROCESS,
      })
      .exec();
    if (products.length !== quantities.size) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    const reserved = await this.reserveStock(
      products.map((product) => ({
        productId: product._id,
        itemQuantity: quantities.get(String(product._id)) as number,
        itemPrice: product.productPrice,
      })),
    );

    // sum in cents: 29.99 + 24.99 in floating point is 54.980000000000004
    const amountCents = reserved.reduce(
      (sum, item) => sum + Math.round(item.itemPrice * 100) * item.itemQuantity,
      0,
    );
    const delivery = amountCents < 100 * 100 ? 5 : 0;

    let newOrder: Order | null = null;
    try {
      newOrder = await this.orderModel.create({
        orderTotal: (amountCents + delivery * 100) / 100,
        orderDelivery: delivery,
        memberId: memberId,
      });
      await this.orderItemModel.insertMany(
        reserved.map((item) => ({ ...item, orderId: newOrder?._id })),
      );
      return newOrder;
    } catch (err) {
      console.log("Error, model: createOrder: ", err);
      // undo everything so a failed order leaves no trace
      if (newOrder) await this.orderModel.deleteOne({ _id: newOrder._id }).exec();
      await this.releaseStock(reserved);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  /** Takes items out of stock one by one; rolls back if any product runs out. */
  private async reserveStock(items: ReservedItem[]): Promise<ReservedItem[]> {
    const done: ReservedItem[] = [];
    for (const item of items) {
      const result = await this.productModel
        .updateOne(
          { _id: item.productId, productLeftCount: { $gte: item.itemQuantity } },
          { $inc: { productLeftCount: -item.itemQuantity } },
        )
        .exec();
      if (result.modifiedCount === 0) {
        await this.releaseStock(done);
        throw new Errors(HttpCode.BAD_REQUEST, Message.OUT_OF_STOCK);
      }
      done.push(item);
    }
    return done;
  }

  private async releaseStock(items: { productId: any; itemQuantity: number }[]): Promise<void> {
    await Promise.all(
      items.map((item) =>
        this.productModel
          .updateOne({ _id: item.productId }, { $inc: { productLeftCount: item.itemQuantity } })
          .exec(),
      ),
    );
  }

  public async getMyOrders(
    member: Member,
    inquiry: OrderInquiry,
  ): Promise<Order[]> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const matches = { memberId: memberId, orderStatus: inquiry.orderStatus };

    const result = await this.orderModel
      .aggregate([
        { $match: matches },
        { $sort: { updatedAt: -1 } },
        { $skip: (inquiry.page - 1) * inquiry.limit },
        { $limit: inquiry.limit },
        {
          $lookup: {
            from: "orderItems",
            localField: "_id",
            foreignField: "orderId",
            as: "orderItems",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.productId",
            foreignField: "_id",
            as: "productData",
          },
        },
      ])
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async updateOrder(
    member: Member,
    input: OrderUpdateInput,
  ): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const orderId = shapeIntoMongooseObjectId(input.orderId),
      orderStatus = input.orderStatus;

    const order = await this.orderModel.findOne({ _id: orderId, memberId: memberId }).exec();
    if (!order) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    if (!ALLOWED_STATUS_CHANGES[order.orderStatus]?.includes(orderStatus)) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_ORDER_STATUS);
    }

    // the status filter makes a double click or a second tab unable to apply the change twice
    const result = await this.orderModel
      .findOneAndUpdate(
        { _id: orderId, memberId: memberId, orderStatus: order.orderStatus },
        { orderStatus: orderStatus },
        { new: true },
      )
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    if (orderStatus === OrderStatus.PROCESS) {
      // PAUSE => PROCESS: +1 point, once per order
      await this.memberService.addUserPoint(member, 1);
    } else if (orderStatus === OrderStatus.DELETE) {
      // cancelled: give the reserved stock back
      const items = await this.orderItemModel.find({ orderId: orderId }).exec();
      await this.releaseStock(
        items.map((item) => ({ productId: item.productId, itemQuantity: item.itemQuantity })),
      );
    }
    return result;
  }
}
export default OrderService;
