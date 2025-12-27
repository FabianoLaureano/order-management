import type { Request, Response, NextFunction } from "express";
import {
  createOrderSchema,
  orderIdParamSchema,
  listOrdersQuerySchema,
} from "../validations/order.validations.ts";
import {
  createOrder,
  advanceOrderState,
  listOrders,
} from "../services/order.services.ts";
import { formatValidationError } from "../utils/format.ts";

export const createOrderHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationResult = createOrderSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValidationError(validationResult.error),
      });
    }

    const { newOrder } = await createOrder(validationResult.data);

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Order creation controller error: ${e.message}`);
    } else {
      console.error(
        "An unknown error occurred in order creation controller:",
        e
      );
    }
    next(e);
  }
};

export const advanceOrderStateHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paramValidation = orderIdParamSchema.safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(400).json({
        error: "Invalid URL parameter",
        details: formatValidationError(paramValidation.error),
      });
    }

    const { id: orderId } = paramValidation.data;

    const { updatedOrder } = await advanceOrderState(orderId);

    res.status(200).json({
      message: `Order state successfully advanced to '${updatedOrder.state}'`,
      order: updatedOrder,
    });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message.includes("not found")) {
        return res.status(404).json({ error: e.message });
      }
      if (
        e.message.includes("final state") ||
        e.message.includes("Invalid current")
      ) {
        return res.status(400).json({ error: e.message });
      }
    }

    console.error(
      `Order state advancement controller error for ID ${req.params.id}:`,
      e
    );
    next(e);
  }
};

export const listOrdersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationResult = listOrdersQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid query parameters",
        details: formatValidationError(validationResult.error),
      });
    }

    const data = await listOrders(validationResult.data);

    res.status(200).json(data);
  } catch (e) {
    if (e instanceof Error) {
      console.error(`List orders controller error: ${e.message}`);
    } else {
      console.error("An unknown error occurred in list orders controller:", e);
    }
    next(e);
  }
};
