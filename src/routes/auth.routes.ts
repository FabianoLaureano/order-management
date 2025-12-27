import { Router } from "express";
import { signUp, signIn } from "../controllers/auth.controller.ts";

const router = Router();

router.post("/register", signUp);
router.post("/login", signIn);

export default router;