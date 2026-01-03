import { z } from "zod";


export const CreateUserDTO = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
    role: z.enum(["user", "admin"]).optional().default("user")
}).refine(
    (data) => data.password === data.confirmPassword, 
    {
        message: "Passwords do not match",
        path: ["confirmPassword"] // Error will be attached to this field
    }
);

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;


export const LoginUserDTO = z.object({
    // Changed z.email() to z.string().email() as per Zod's standard syntax
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password is required")
});

export type LoginUserDTO = z.infer<typeof LoginUserDTO>;