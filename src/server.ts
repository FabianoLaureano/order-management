import express from "express";
import cookieParser from "cookie-parser";
import config from "./config/index.ts";
import { connectDatabase } from "./lib/mongoose.ts";
import router from "./routes/index.ts";

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

server.use("/", router);

server.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
  connectDatabase().catch((error) => {
    console.error("Failed to connect to the database on server start:", error);
  });
});
