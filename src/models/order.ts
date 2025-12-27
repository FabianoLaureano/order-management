import { Schema, model } from "mongoose";

export interface IService {
  name: string;
  value: number;
  status: "PENDING" | "DONE";
}

export interface IOrder {
  lab: string;
  patient: string;
  customer: string;
  state: "CREATED" | "ANALYSIS" | "COMPLETED";
  status: "ACTIVE" | "DELETED";
  services: IService[];
}

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    value: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "DONE"],
      default: "PENDING",
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>({
  lab: { type: String, required: true },
  patient: { type: String, required: true },
  customer: { type: String, required: true },
  state: {
    type: String,
    enum: ["CREATED", "ANALYSIS", "COMPLETED"],
    default: "CREATED",
    required: true,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "DELETED"],
    default: "ACTIVE",
    required: true,
  },
  services: {
    type: [serviceSchema],
    required: true,
  },
});

const Order = model<IOrder>("Order", orderSchema);

export default Order;
