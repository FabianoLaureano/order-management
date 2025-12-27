import { z } from "zod";
import { Types } from "mongoose";

export const serviceValidationSchema = z.object({
  name: z.string(),
  value: z.number().positive("Service value must be a positive number"),
  status: z.enum(["PENDING", "DONE"]).optional(),
});

export const createOrderSchema = z.object({
  lab: z.string(),
  patient: z.string(),
  customer: z.string(),
  services: z
    .array(serviceValidationSchema)
    .min(1, "An order must have at least one service."),
});

export const updateOrderSchema = z.object({
  lab: z.string().optional(),
  patient: z.string().optional(),
  customer: z.string().optional(),
  state: z.enum(["CREATED", "ANALYSIS", "COMPLETED"]).optional(),
  status: z.enum(["ACTIVE", "DELETED"]).optional(),
  services: z
    .array(serviceValidationSchema)
    .min(1, "An order must have at least one service.")
    .optional(),
});

export const orderIdParamSchema = z.object({
  id: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid Order ID provided in URL.",
  }),
});

export const listOrdersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  state: z.enum(["CREATED", "ANALYSIS", "COMPLETED"]).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type ListOrdersQueryInput = z.infer<typeof listOrdersQuerySchema>;
