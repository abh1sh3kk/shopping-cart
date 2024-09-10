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
import { morganMiddleware } from "./middlewares/morgan";

export const app: Express = express();
const port = process.env.PORT || 3000;

dotenv.config();

app.use(morganMiddleware);

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true, customCssUrl: "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-feeling-blue.css" }));
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", UserController.health);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
