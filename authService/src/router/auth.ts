import { Router } from "express";
import AuthController from "../controller/authController";

const authRouter = Router();

const authController = new AuthController();

authRouter.post("/register", (req, res) => authController.register(req, res));

export default authRouter;
