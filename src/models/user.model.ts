import mongoose, { Document, Schema } from "mongoose"; 
import { UserType } from "../types/user.type";

const UserSchema: Schema = new Schema({
    fullName: { 
        type: String, 
        required: false, 
        trim: true 
    }, 
    username: { 
        type: String, 
        required: false, 
        trim: true 
    }, 
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    }, 
    password: { 
        type: String, 
        required: true, 
        minLength: 6 
    },
    profilePicture: {
        type: String,
        required: false,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    }
}, {
    timestamps: true,
});

export interface IUser extends UserType, Document {
    fullName: any; 
    username: any;
    profilePicture: string;
    _id: mongoose.Types.ObjectId; 
    createdAt: Date; 
    updatedAt: Date;
}

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);