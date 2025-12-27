import { Router } from "express";
import authRoutes from "./auth.routes.ts";
import orderRoutes from "./order.routes.ts";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "API is running",
    status: "Ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/orders", orderRoutes);

export default router;
