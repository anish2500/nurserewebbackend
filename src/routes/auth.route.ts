import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const authController = new AuthController();
const router = Router(); 

// .bind ensures the "this" inside the controller points to authController
router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));

export default router;