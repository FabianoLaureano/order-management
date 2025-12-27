import type { FilterQuery } from "mongoose";
import type { IOrder } from "../models/order.ts";
import type {
  CreateOrderInput,
  ListOrdersQueryInput,
} from "../validations/order.validations.ts";
import Order from "../models/order.ts";

export const createOrder = async (input: CreateOrderInput) => {
  try {
    const newOrder = await Order.create(input);
    console.info(`Order created successfully with ID: ${newOrder._id}`);
    return { newOrder };
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Error creating the order: ${e.message}`);
    } else {
      console.error("An unknown error occurred during order creation:", e);
    }
    // Rethrow a new generic error to hide implementation details from the controller.
    throw new Error("Failed to create order in database.");
  }
};

export const advanceOrderState = async (orderId: string) => {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    let nextState: "ANALYSIS" | "COMPLETED";

    switch (order.state) {
      case "CREATED":
        nextState = "ANALYSIS";
        break;
      case "ANALYSIS":
        nextState = "COMPLETED";
        break;
      case "COMPLETED":
        throw new Error(
          "Order is already in its final state and cannot be advanced further."
        );
      default:
        throw new Error("Invalid current order state.");
    }

    order.state = nextState;
    const updatedOrder = await order.save();

    console.info(
      `Order ${updatedOrder._id} advanced to state: ${updatedOrder.state}`
    );
    return { updatedOrder };
  } catch (e) {
    if (e instanceof Error) {
      console.error(
        `Error advancing order state for ID ${orderId}: ${e.message}`
      );
    } else {
      console.error(`An unknown error occurred for order ID ${orderId}:`, e);
    }
    throw e;
  }
};

export const listOrders = async (query: ListOrdersQueryInput) => {
  const { page, limit, state } = query;

  const filter: FilterQuery<IOrder> = { status: "ACTIVE" };
  if (state) {
    filter.state = state;
  }

  const skip = (page - 1) * limit;

  try {
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ _id: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      orders,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
      },
    };
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Error listing orders: ${e.message}`);
    } else {
      console.error("An unknown error occurred while listing orders:", e);
    }
    throw new Error("Failed to list orders from the database.");
  }
};
