import { Router } from "express";
import { AdminController } from "../../controllers/admin/admin.controller";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";

const router = Router();
const adminController = new AdminController();

const verifyToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

router.post("/register", adminController.registerAdmin.bind(adminController));
router.post("/login", adminController.loginAdmin.bind(adminController));

router.get("/profile", verifyToken, adminController.getAdminProfile.bind(adminController));
router.put("/profile", verifyToken, adminController.updateAdminProfile.bind(adminController));

router.get("/", verifyToken, adminController.getAllAdmins.bind(adminController));
router.get("/:adminId", verifyToken, adminController.getAdminById.bind(adminController));
router.delete("/:adminId", verifyToken, adminController.deleteAdmin.bind(adminController));

// User Management Routes for Admin
router.get("/users/all", verifyToken, adminController.getAllUsers.bind(adminController));
router.get("/users/:userId", verifyToken, adminController.getUserById.bind(adminController));
router.delete("/users/:userId", verifyToken, adminController.deleteUser.bind(adminController));

export default router;
