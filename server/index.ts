import express, { Express, Request, Response } from "express";
import "./configs/db";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { authenticateUser } from "./middlewares/authenticate";
import UserController from "./controllers/user.controller";
import ProductController from "./controllers/product.controller";
import swaggerUi from "swagger-ui-express";
// import swaggerOutput from "./swagger_output.json";
import swaggerOutput from "./configs/swagger_output.json";

dotenv.config();

export const app: Express = express();
const port = process.env.PORT || 3000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", UserController.health);
app.post("/login", UserController.login);
app.get("/logout", UserController.logout);
app.get("/user", UserController.getUserData);
app.post("/user/add", UserController.addUser);

app.get("/products", ProductController.fetchProducts);
app.get("/product/:id", ProductController.fetchProduct);
app.post("/cart/add", authenticateUser, ProductController.addCart);
app.delete("/cart/remove/:id", authenticateUser, ProductController.removeCart);
app.get("/checkout", authenticateUser, ProductController.checkout);
app.delete("/history/thanos", authenticateUser, ProductController.thanos);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
