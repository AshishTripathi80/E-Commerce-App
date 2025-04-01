import { Request, Response, NextFunction } from 'express';
import AuthController from '../../src/controller/auth.controller';
import authService from '../../src/service/auth.service';

// Mock the authService and logger modules
jest.mock('../../src/service/auth.service', () => ({
  __esModule: true,
  default: {
    register: jest.fn(),
    login: jest.fn(),
  },
}));

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

const mockRequest = (body: any): Request => ({
  body,
} as Request);

const mockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res as Response;
};

const mockNext: NextFunction = jest.fn();

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('register', () => {
    it('should return 400 if name is missing', async () => {
      const req = mockRequest({ email: 'test@example.com', password: 'password' });
      const res = mockResponse();
      await AuthController.register(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Please provide all required fields: name, email, password'
      });
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Registration failed - Missing required fields',
        {
          missingFields: { name: true, email: false, password: false }
        }
      );
    });

    it('should return 400 if email is invalid', async () => {
      const req = mockRequest({ name: 'test', email: 'invalid-email', password: 'password' });
      const res = mockResponse();
      await AuthController.register(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Please provide a valid email address' });
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Registration failed - Invalid email format: invalid-email'
      );
    });

    it('should return 400 if password is too short', async () => {
      const req = mockRequest({ name: 'test', email: 'test@example.com', password: 'short' });
      const res = mockResponse();
      await AuthController.register(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Password must be at least 6 characters long'
      });
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Registration failed - Password too short for email: test@example.com'
      );
    });

    it('should call authService.register and log success on valid input', async () => {
      const req = mockRequest({ name: 'test', email: 'test@example.com', password: 'password123' });
      const res = mockResponse();
      (authService.register as jest.Mock).mockResolvedValue(undefined);
      await AuthController.register(req, res, mockNext);

      expect(authService.register).toHaveBeenCalledWith(req, res);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'User registered successfully: test@example.com'
      );
    });

    it('should handle server errors during registration', async () => {
      const req = mockRequest({ name: 'test', email: 'test@example.com', password: 'password123' });
      const res = mockResponse();
      const error = new Error('Some error');
      (authService.register as jest.Mock).mockRejectedValue(error);
      await AuthController.register(req, res, mockNext);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Registration error for email: test@example.com',
        { error }
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('login', () => {
    it('should return 400 if email is missing', async () => {
      const req = mockRequest({ password: 'password' });
      const res = mockResponse();
      await AuthController.login(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Please provide both email and password'
      });
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Login failed - Missing credentials',
        {
          email: undefined,
          missingFields: { email: true, password: false }
        }
      );
    });

    it('should return 400 if password is missing', async () => {
      const req = mockRequest({ email: 'test@example.com' });
      const res = mockResponse();
      await AuthController.login(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Please provide both email and password'
      });
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Login failed - Missing credentials',
        {
          email: 'test@example.com',
          missingFields: { email: false, password: true }
        }
      );
    });

    it('should return 400 for invalid email format', async () => {
      const req = mockRequest({ email: 'invalid', password: 'password' });
      const res = mockResponse();
      await AuthController.login(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Please provide a valid email address' });
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Login failed - Invalid email format: invalid'
      );
    });

    it('should call authService.login and log success on valid input', async () => {
      const req = mockRequest({ email: 'test@example.com', password: 'password123' });
      const res = mockResponse();
      (authService.login as jest.Mock).mockResolvedValue(undefined);
      await AuthController.login(req, res, mockNext);

      expect(authService.login).toHaveBeenCalledWith(req, res);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'User logged in successfully: test@example.com'
      );
    });

    it('should handle server errors during login', async () => {
      const req = mockRequest({ email: 'test@example.com', password: 'password123' });
      const res = mockResponse();
      const error = new Error('Some error');
      (authService.login as jest.Mock).mockRejectedValue(error);
      await AuthController.login(req, res, mockNext);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Login error for email: test@example.com',
        { error }
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});