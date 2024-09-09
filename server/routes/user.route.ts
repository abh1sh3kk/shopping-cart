import express from "express";
import UserController from "../controllers/user.controller";
// import "../configs/swagger_manual";
import "../configs/swagger-schema";
import { authenticateUser } from "../middlewares/authenticate";

const router = express.Router();

router.post("/login", UserController.login);
router.get("/logout", authenticateUser, UserController.logout);
router.get("/list", authenticateUser, UserController.getUserData);
router.post("/add", authenticateUser, UserController.addUser);

export default router;
