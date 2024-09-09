import express from "express";
import ProductController from "../controllers/product.controller";

const router = express.Router();

router.get("/list", ProductController.fetchProducts);
router.get("/:id", ProductController.fetchProduct);

export default router;
