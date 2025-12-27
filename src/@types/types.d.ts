import express from "express";

declare module "express" {
  interface Request {
    user?: {
      sub: string;
    };
  }
}
