import { Request, Response } from 'express';
import authService from '../service/auth.service';
class AuthController {

    async register(req: Request, res: Response) {
        await authService.register(req, res);
    }

    async login(req: Request, res: Response) {
        await authService.login(req, res);
    }
}

export default new AuthController();

