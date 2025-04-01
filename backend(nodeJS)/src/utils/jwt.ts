import jwt, { SignOptions, Secret } from 'jsonwebtoken';


const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-default-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h'; 

export const generateToken = (userId: string): string => {
    const options: SignOptions = {
        expiresIn: JWT_EXPIRES_IN
    };
    return jwt.sign({ id: userId }, JWT_SECRET, options);
}