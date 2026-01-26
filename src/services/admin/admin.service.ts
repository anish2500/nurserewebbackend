import { AdminRepository } from "../../repositories/admin/admin.repository";
import bcryptjs from "bcryptjs";
import { HttpError } from "../../errors/http-error";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";

const adminRepository = new AdminRepository();

export class AdminService {
    async registerAdmin(data: any) {
        const emailCheck = await adminRepository.getUserbyEmail(data.email);
        if (emailCheck) {
            throw new HttpError(403, "Email already in use");
        }

        let fullName = data.fullName;
        let username = data.username;
        
        if (!username) {
            username = data.email.split('@')[0];
        }
        
        if (!fullName && username) {
            fullName = username;
        }
        
        if (!fullName && !username) {
            fullName = data.email.split('@')[0];
            username = data.email.split('@')[0];
        }

        const hashedPassword = await bcryptjs.hash(data.password, 10);

        const { confirmPassword, ...adminData } = data;
        
        if (data.confirmPassword && data.password !== data.confirmPassword) {
            throw new HttpError(400, "Passwords do not match");
        }

        const newAdmin = await adminRepository.createUser({
            ...adminData,
            fullName: fullName || undefined,
            username: username,
            password: hashedPassword,
            profilePicture: adminData.profilePicture || undefined
        });

        return newAdmin;
    }

    async loginAdmin(data: any) {
        const admin = await adminRepository.getUserbyEmail(data.email);
        if (!admin) {
            throw new HttpError(404, "Admin not found");
        }

        const isPasswordValid = await bcryptjs.compare(data.password, admin.password);
        if (!isPasswordValid) {
            throw new HttpError(401, "Invalid credentials");
        }

        const payload = {
            id: admin._id,
            email: admin.email,
            fullName: admin.fullName,
            role: admin.role,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

        return { token, admin };
    }

    async updateAdminProfile(adminId: string, updateData: any) {
        const admin = await adminRepository.getUserById(adminId);
        if (!admin) {
            throw new HttpError(404, "Admin not found");
        }

        const updatedAdmin = await adminRepository.updateOneAdmin(adminId, updateData);
        return updatedAdmin;
    }

    async getAdminById(adminId: string) {
        const admin = await adminRepository.getUserById(adminId);
        if (!admin) {
            throw new HttpError(404, "Admin not found");
        }
        return admin;
    }

    async getAllAdmins() {
        const admins = await adminRepository.getAllAdmins();
        return admins;
    }

    async deleteAdmin(adminId: string) {
        const admin = await adminRepository.getUserById(adminId);
        if (!admin) {
            throw new HttpError(404, "Admin not found");
        }

        const result = await adminRepository.deleteOneAdmin(adminId);
        return result;
    }
}
