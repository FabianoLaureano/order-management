import { Router } from "express";
import {
  createOrderHandler,
  advanceOrderStateHandler,
  listOrdersHandler,
} from "../controllers/order.controller.ts";
import { authenticateToken } from "../middlewares/auth.middleware.ts";

const orderRoutes = Router();

orderRoutes.get("/", authenticateToken, listOrdersHandler);

orderRoutes.post("/", authenticateToken, createOrderHandler);

orderRoutes.patch("/:id/advance", authenticateToken, advanceOrderStateHandler);

export default orderRoutes;
