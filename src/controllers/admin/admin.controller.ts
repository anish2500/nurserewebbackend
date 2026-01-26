import { Request, Response, NextFunction } from "express";
import { AdminService } from "../../services/admin/admin.service";
import { UserService } from "../../services/user.service";
import { HttpError } from "../../errors/http-error";
import { IAdmin } from "../../models/admin/admin.model";
import { IUser } from "../../models/user.model";

const adminService = new AdminService();
const userService = new UserService();

export class AdminController {
    async registerAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = req.body;
            const newAdmin = await adminService.registerAdmin(validatedData);
            
            const { password, ...adminResponse } = newAdmin.toObject();
            
            res.status(201).json({
                success: true,
                message: "Admin registered successfully",
                data: adminResponse
            });
        } catch (error) {
            next(error);
        }
    }

    async loginAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const loginData = req.body;
            const result = await adminService.loginAdmin(loginData);
            
            const { password, ...adminResponse } = result.admin.toObject();
            
            res.status(200).json({
                success: true,
                message: "Admin login successful",
                data: {
                    token: result.token,
                    admin: adminResponse
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getAdminProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const adminId = (req as any).user.id;
            const admin = await adminService.getAdminById(adminId);
            
            const { password, ...adminResponse } = admin.toObject();
            
            res.status(200).json({
                success: true,
                message: "Admin profile retrieved successfully",
                data: adminResponse
            });
        } catch (error) {
            next(error);
        }
    }

    async updateAdminProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const adminId = (req as any).user.id;
            const updateData = req.body;
            
            if (updateData.password) {
                delete updateData.password;
            }
            
            const updatedAdmin = await adminService.updateAdminProfile(adminId, updateData);
            
            if (!updatedAdmin) {
                return res.status(404).json({
                    success: false,
                    message: "Admin not found"
                });
            }
            
            const { password, ...adminResponse } = updatedAdmin.toObject();
            
            res.status(200).json({
                success: true,
                message: "Admin profile updated successfully",
                data: adminResponse
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllAdmins(req: Request, res: Response, next: NextFunction) {
        try {
            const admins = await adminService.getAllAdmins();
            
            const adminsResponse = admins.map((admin: IAdmin) => {
                const { password, ...adminData } = admin.toObject();
                return adminData;
            });
            
            res.status(200).json({
                success: true,
                message: "All admins retrieved successfully",
                data: adminsResponse
            });
        } catch (error) {
            next(error);
        }
    }

    async getAdminById(req: Request, res: Response, next: NextFunction) {
        try {
            const { adminId } = req.params;
            const admin = await adminService.getAdminById(adminId);
            
            const { password, ...adminResponse } = admin.toObject();
            
            res.status(200).json({
                success: true,
                message: "Admin retrieved successfully",
                data: adminResponse
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const { adminId } = req.params;
            const result = await adminService.deleteAdmin(adminId);
            
            res.status(200).json({
                success: true,
                message: "Admin deleted successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    // User Management Methods for Admin
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.getAllUsers();
            
            const usersResponse = users.map((user: IUser) => {
                const { password, ...userData } = user.toObject();
                return userData;
            });
            
            res.status(200).json({
                success: true,
                message: "All users retrieved successfully",
                data: usersResponse
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const user = await userService.getUserById(userId);
            
            const { password, ...userResponse } = user.toObject();
            
            res.status(200).json({
                success: true,
                message: "User retrieved successfully",
                data: userResponse
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const result = await userService.deleteUser(userId);
            
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
