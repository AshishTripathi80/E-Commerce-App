import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../model/user.model';
import { generateToken } from '../utils/jwt';

class AuthService {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password, role } = req.body;

            // Create user with hashed password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: role || 'CUSTOMER' // default role if not provided
            });

            // Generate JWT token
            const token = generateToken(user._id.toString());

            // Send response with token in header (lowercase 'authorization' to match frontend)
            res.setHeader('authorization', `Bearer ${token}`);
            res.status(201).json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } catch (error: any) {
            // Handle MongoDB duplicate key error
            if (error.code === 11000) {
                res.status(400).json({ message: 'User already exists' });
                return;
            }
            res.status(500).json({ message: 'Error creating user' });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            // Find user and include password in selection
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            // Generate JWT token
            const token = generateToken(user._id.toString());

            // Send response with token in header (lowercase 'authorization' to match frontend)
            res.setHeader('authorization', `Bearer ${token}`);
            
            // Send only necessary user data that frontend expects
            const userData = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            };

            res.status(200).json(userData);
        } catch (error) {
            res.status(500).json({ message: 'Error during login' });
        }
    }
}

export default new AuthService();
