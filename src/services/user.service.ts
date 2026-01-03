import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { UserRepository } from "../repositories/user.repository";
import bcryptjs from "bcryptjs";
import { HttpError } from "../errors/http-error";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

// Instantiate the repository to use its methods
const userRepository = new UserRepository();

export class UserService {
    /**
     * Signup Logic
     */
    async registerUser(data: CreateUserDTO) {
        // 1. Check if the email already exists
        const emailCheck = await userRepository.getUserbyEmail(data.email);
        if (emailCheck) {
            throw new HttpError(403, "Email already in use");
        }

        // 2. Hash the password (Complexity level: 10)
        const hashedPassword = await bcryptjs.hash(data.password, 10);

        // 3. Prepare data for Repository
        // We strip out 'confirmPassword' because the Model doesn't accept it
        const { confirmPassword, ...userData } = data;
        
        // 4. Create the user with the hashed password
        const newUser = await userRepository.createUser({
            ...userData,
            password: hashedPassword
        });

        return newUser;
    }

    /**
     * Login Logic
     */
    async loginUser(data: LoginUserDTO) {
        // 1. Check if the user exists by email
        const user = await userRepository.getUserbyEmail(data.email);
        if (!user) {
            throw new HttpError(404, "User not found");
        }

        // 2. Compare the plain-text password with the hashed password in DB
        const isPasswordValid = await bcryptjs.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new HttpError(401, "Invalid credentials");
        }

        // 3. Generate JWT Payload
        const payload = {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
        };

        // 4. Sign the token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

        return { token, user };
    }
}