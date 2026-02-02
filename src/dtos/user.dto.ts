import { z } from "zod";

export const CreateUserDTO = z.object({
    fullName: z.string().min(2, "Full name is required").optional().nullable(),
    username: z.string().min(2, "Username is required").optional().nullable(),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required").optional(),
    profilePicture: z.string().url("Invalid URL format").optional().nullable(),
    role: z.enum(["user", "admin"]).optional().default("user")
}).refine(
    (data) => {
        // Only validate password matching if confirmPassword is provided
        if (data.confirmPassword) {
            return data.password === data.confirmPassword;
        }
        return true;
    }, 
    {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    }
);

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

export const LoginUserDTO = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password is required")
});

export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

export const UpdateUserDto = z.object({
    fullName: z.string().min(2, "Full name is required").optional(),
    username: z.string().min(2, "Username is required").optional(),
    email: z.string().email("Invalid email format").optional(),
    profilePicture: z.string().optional().nullable(),
    imageUrl: z.string().optional()
});

export type UpdateUserDto = z.infer<typeof UpdateUserDto>;