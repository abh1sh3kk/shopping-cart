import express, { Express, Request, Response } from "express";
import "./configs/db";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import UserController from "./controllers/user.controller";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import userRouter from "./routes/user.route";
import productRouter from "./routes/product.route";
import cartRouter from "./routes/cart.route";
import { options } from "./configs/swagger-options";

import morgan from "morgan";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export const app: Express = express();
const port = process.env.PORT || 3000;

dotenv.config();

const { combine, timestamp, json } = winston.format;

const auditLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new DailyRotateFile({
      filename: "audit-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      dirname: "./logs/audit",
      maxFiles: "14d", // Keep logs for 14 days
    }),
    new winston.transports.Console(),
  ],
});

const logger = winston.createLogger({
  level: "http",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    json()
  ),
  transports: [new winston.transports.Console()],
});

// Requirement
// -	Date time
// -	Method
// -	URL
// -	Response content size (in bytes or KB)
// -	Response time (in ms)
// -	User-agent

const morganMiddleware = morgan(
  ":date[iso] :method :url :status :res[content-length] bytes - :response-time ms - :user-agent",
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
);

app.use(morganMiddleware);

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", UserController.health);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
