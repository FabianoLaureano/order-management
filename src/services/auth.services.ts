import type { signInSchemaType } from "../validations/auth.validations.ts";
import bcrypt from "bcrypt";
import User from "../models/user.ts";

export const hashPassword = async (password: string) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    console.error(`Error hashing the password: ${e}`);
    throw new Error("Error hashing");
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (e) {
    console.error(`Error comparing password: ${e}`);
    throw new Error("Error comparing password");
  }
};

export const createUser = async ({ email, password }: signInSchemaType) => {
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const password_hash = await hashPassword(password);

    const newUser = await User.create({
      email,
      password: password_hash,
    });

    console.info(`User ${newUser.email} created successfully`);
    return newUser;
  } catch (e) {
    console.error(`Error creating the user: ${e}`);
    throw e;
  }
};

export const authenticateUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const isPasswordValid = await comparePassword(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    console.info(`User ${existingUser.email} authenticated successfully`);
    return {
      id: existingUser._id,
      email: existingUser.email,
    };
  } catch (e) {
    console.error(`Error authenticating user: ${e}`);
    throw e;
  }
};