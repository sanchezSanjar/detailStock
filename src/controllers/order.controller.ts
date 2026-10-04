import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import { ExtendedRequest } from "../libs/types/member";
import { Response } from "express";
import OrderService from "../models/Order.service";
import { OrderInquiry,OrderUpdateInput } from "../libs/types/order";
import { OrderStatus } from "../libs/enums/order.enum";

const orderService = new OrderService();

const orderController: T = {};

orderController.createOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("createOrder");
    const result = await orderService.createOrder(req.member, req.body);

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.log("Error, createOrder:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

orderController.getMyOrders = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getMyOrders");
    const { page, limit, orderStatus } = req.query;
    //console.log("req.query:", req.query);
    if (!Object.values(OrderStatus).includes(orderStatus as OrderStatus)) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.INVALID_ORDER_STATUS);
    }
    // NaN or huge values would break $skip / $limit
    const inquiry: OrderInquiry = {
      page: Math.max(1, Math.floor(Number(page)) || 1),
      limit: Math.min(50, Math.max(1, Math.floor(Number(limit)) || 5)),
      orderStatus: orderStatus as OrderStatus,
    };
    console.log("inquiry: ", inquiry);
    const result = await orderService.getMyOrders(req.member, inquiry);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getMyOrders:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

orderController.updateOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("updateOrder");
    const input: OrderUpdateInput = req.body;
    //console.log("input: ", input);
    const result = await orderService.updateOrder(req.member, input);

    res.status(HttpCode.OK).json({ result });
  } catch (err) {
    console.log("Error, updateOrder:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};


export default orderController;