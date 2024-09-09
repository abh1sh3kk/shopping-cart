import express from "express";
import ProductController from "../controllers/product.controller";
import { authenticateUser } from "../middlewares/authenticate";

const router = express.Router();

router.post("/add", authenticateUser, ProductController.addCart);
router.delete("/remove/:id", authenticateUser, ProductController.removeCart);
router.get("/checkout", authenticateUser, ProductController.checkout);
router.delete("/history/thanos", authenticateUser, ProductController.thanos);

export default router;