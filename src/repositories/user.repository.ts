import { IUser, UserModel } from "../models/user.model"; 

export interface IUserRepository {
    // Removed getUserbyUsername as it is not in your current model
    getUserbyEmail(email: string): Promise<IUser | null>;

    // Five common CRUD functions
    createUser(data: Partial<IUser>): Promise<IUser>; 
    getUserById(id: string): Promise<IUser | null>; 
    getAllUsers(): Promise<IUser[]>;
    updateOneUser(id: string, data: Partial<IUser>): Promise<IUser | null>; 
    deleteOneUser(id: string): Promise<boolean | null>; 
}

export class UserRepository implements IUserRepository {
 
    // Create: Used for Signup
    async createUser(data: Partial<IUser>): Promise<IUser> {
        const user = new UserModel(data); 
        return await user.save();
    }

    // Read: Used for Login to find the user and check password
    async getUserbyEmail(email: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ "email": email });
        return user; 
    }

    // Read: Find a specific user by MongoDB ID
    async getUserById(id: string): Promise<IUser | null> {
        const user = await UserModel.findById(id);
        return user; 
    }

    // Read: Fetch all users (useful for Admin dashboards)
    async getAllUsers(): Promise<IUser[]> {
        const users = await UserModel.find();
        return users;
    }

    // Update: Modify user details
    async updateOneUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
        const updatedUser = await UserModel.findByIdAndUpdate(id, data, { new: true });
        return updatedUser; 
    }

    // Delete: Remove user from database
    async deleteOneUser(id: string): Promise<boolean | null> {
        const result = await UserModel.findByIdAndDelete(id); 
        return result ? true : null; 
    }
}