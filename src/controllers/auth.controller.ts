import type { Request, Response, NextFunction } from "express";
import { signUpSchema } from "../validations/auth.validations.ts";
import { signInSchema } from "../validations/auth.validations.ts";
import { createUser, authenticateUser } from "../services/auth.services.ts";
import { jwttoken } from "../utils/jwt.ts";
import { cookies } from "../utils/cookies.ts";
import { formatValidationError } from "../utils/format.ts";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationResult = signUpSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    console.log(email, password);

    const user = await createUser({ email, password });

    const token = jwttoken.sign({
      sub: user._id.toString(),
      email: user.email,
    });

    cookies.set(res, "token", token);

    console.info(`User registered successfully: ${email}`);
    res.status(201).json({
      message: "User registered",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (e) {
    console.error("Signup error", e);

    if (e instanceof Error) {
      if (e.message === "User with this email already exists") {
        return res.status(409).json({ error: e.message });
      }
    }

    next(e);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const user = await authenticateUser({ email, password });

    const token = jwttoken.sign({
      sub: user.id.toString(),
      email: user.email,
    });

    cookies.set(res, "token", token);

    console.info(`User signed in successfully: ${email}`);
    res.status(200).json({
      message: "User signed in successfully",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (e) {
    console.error("Sign in error", e);

    if (
      e instanceof Error &&
      (e.message === "User not found" || e.message === "Invalid password")
    ) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    next(e);
  }
};
