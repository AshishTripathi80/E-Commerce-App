import { Request, Response, NextFunction } from 'express';
import authService from '../service/auth.service';
import logger from '../config/logger';

class AuthController {
    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, email, password } = req.body;

            // Validate required fields
            if (!name || !email || !password) {
                logger.warn(`Registration failed - Missing fields`, { 
                    email,
                    missingFields: {
                        name: !name,
                        email: !email,
                        password: !password
                    }
                });
                res.status(400).json({
                    message: 'Please provide all required fields: name, email, password'
                });
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                logger.warn(`Registration failed - Invalid email format: ${email}`);
                res.status(400).json({
                    message: 'Please provide a valid email address'
                });
                return;
            }

            // Validate password strength
            if (password.length < 6) {
                logger.warn(`Registration failed - Password too short for email: ${email}`);
                res.status(400).json({
                    message: 'Password must be at least 6 characters long'
                });
                return;
            }

            await authService.register(req, res);
            logger.info(`User registered successfully: ${email}`);
        } catch (error) {
            logger.error(`Registration error for email: ${req.body.email}`, { error });
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;

            // Validate required fields
            if (!email || !password) {
                logger.warn(`Login failed - Missing credentials`, {
                    email,
                    missingFields: {
                        email: !email,
                        password: !password
                    }
                });
                res.status(400).json({
                    message: 'Please provide both email and password'
                });
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                logger.warn(`Login failed - Invalid email format: ${email}`);
                res.status(400).json({
                    message: 'Please provide a valid email address'
                });
                return;
            }

            await authService.login(req, res);
            logger.info(`User logged in successfully: ${email}`);
        } catch (error) {
            logger.error(`Login error for email: ${req.body.email}`, { error });
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}

export default new AuthController();

