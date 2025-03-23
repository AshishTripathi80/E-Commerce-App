import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../model/user';
import { generateToken } from '../utils/jwt';

class AuthService {
    // Using a literal string instead of env variable for type safety

    async register(req: Request, res: Response) {
        try {
            const { name, email, password, role, img } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user with hashed password
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                role,
                img
            });

            // Generate JWT token
            const token = generateToken(user._id.toString());

            res.status(201).json({
                message: 'User created successfully',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                return res.status(400).json({ message: 'Please provide email and password' });
            }

            // Find user and include password in selection
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = generateToken(user._id.toString());

            // Set secure HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });

            res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error during login', error });
        }
    }

    
}

export default new AuthService();
