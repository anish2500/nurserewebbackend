import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserService } from "../services/user.service";
import { uploadProfilePicture } from "../middlewares/upload.middleware";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

const authController = new AuthController();
const userService = new UserService();
const router = Router(); 

// Middleware to verify JWT token
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

// Auth routes
router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));

// Profile management routes (integrated into auth)
router.put("/profile", verifyToken, uploadProfilePicture.single("profilePicture"), async (req: any, res: any) => {
    try {
        const userId = req.user.id;
        const { fullName, username } = req.body;
        
        // Prepare update data - only include provided fields
        const updateData: any = {};
        
        // If a file was uploaded, use its filename
        if (req.file) {
            updateData.profilePicture = req.file.filename;
        } else if (req.body.profilePicture !== undefined) {
            // If no file but profilePicture in body (for string URLs)
            updateData.profilePicture = req.body.profilePicture;
        }
        
        if (fullName !== undefined) updateData.fullName = fullName;
        if (username !== undefined) updateData.username = username;
        
        // Update user profile
        const updatedUser = await userService.updateUserProfile(userId, updateData);
        
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });
        
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});

router.get("/profile", verifyToken, async (req: any, res: any) => {
    try {
        const userId = req.user.id;
        
        // Get user profile
        const user = await userService.getUserById(userId);
        
        return res.status(200).json({
            success: true,
            data: user
        });
        
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});

export default router;