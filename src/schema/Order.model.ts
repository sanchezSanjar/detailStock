import mongoose, { Types, Schema } from "mongoose";
import { OrderStatus } from "../libs/enums/order.enum";
import { Order } from "../libs/types/order";

const orderSchema = new Schema<Order>(
  {
    orderTotal: {
      type: Number,
      required: true,
    },
    orderDelivery: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.PAUSE,
    },
    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },
  },
  { timestamps: true },
);

export default mongoose.model<Order>("Order", orderSchema);