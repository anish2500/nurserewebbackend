import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";

const userService = new UserService();

export class AuthController {
    
    // Changed to Arrow Function to preserve 'this' context
    register = async (req: Request, res: Response) => {
        try {
            const parsedData = CreateUserDTO.safeParse(req.body);

            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: "Validation Error",
                    errors: parsedData.error.flatten().fieldErrors 
                });
            }

            const newUser = await userService.registerUser(parsedData.data);

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: newUser
            });

        } catch (error: any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    // Changed to Arrow Function to preserve 'this' context
    login = async (req: Request, res: Response) => {
        try {
            const parsedData = LoginUserDTO.safeParse(req.body);

            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: "Validation Error",
                    errors: parsedData.error.flatten().fieldErrors
                });
            }

            const { token, user } = await userService.loginUser(parsedData.data);

            return res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                data: user
            });

        } catch (error: any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }
}