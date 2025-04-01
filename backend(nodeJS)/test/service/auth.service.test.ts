// AuthService.test.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../src/model/user.model";
import { generateToken } from "../../src/utils/jwt";
import authService from "../../src/service/auth.service";

// Mock dependencies
jest.mock("bcryptjs");
jest.mock("../../src/model/user.model");
jest.mock("../../src/utils/jwt");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("shuld register new user, set header, `genarate token, and return user data", async () => {
      // arrange
      const req = {
        body: {
          name: "ashish",
          email: "ashish@gamil.com",
          password: "password123",
          role: "CUSTOMER",
        },
      } as Request;

      const res = {
        setHeader: jest.fn(),
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      // Set up mocks for bcrypt and User.create
      (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (User.create as jest.Mock).mockResolvedValue({
        _id: "123",
        name: "ashish",
        email: "ashish@gamil.com",
        role: "CUSTOMER",
      });
      (generateToken as jest.Mock).mockResolvedValue("token");

      //act
      await authService.register(req, res);

      //assert
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", "salt");
      expect(User.create).toHaveBeenCalledWith({
        name: "ashish",
        email: "ashish@gamil.com",
        password: "hashedPassword",
        role: "CUSTOMER",
      });
      const token = await generateToken('123');
      res.setHeader('authorization', `Bearer ${token}`);
      expect(generateToken).toHaveBeenCalledWith('123');
      expect(res.setHeader).toHaveBeenCalledWith('authorization', 'Bearer token');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: '123',
        name: "ashish",
        email: "ashish@gamil.com",
        role: 'CUSTOMER'
      });
    });

    it('should return 400 if user already exists', async () => {
      // Arrange
      const req = {
        body: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123'
        }
      } as Request;

      const res = {
        setHeader: jest.fn(),
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      // Simulate MongoDB duplicate key error (code 11000)
      const duplicateError = new Error('Duplicate key error');
      (duplicateError as any).code = 11000;
      (User.create as jest.Mock).mockRejectedValue(duplicateError);

      // Act
      await authService.register(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });

    it('should return 500 if there is a general error during registration', async () => {
      // Arrange
      const req = {
        body: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123'
        }
      } as Request;

      const res = {
        setHeader: jest.fn(),
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      (User.create as jest.Mock).mockRejectedValue(new Error('Some error'));

      // Act
      await authService.register(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error creating user' });
    });
  });

  describe('login', () => {
    it('should login user with valid credentials, generate a token, set the header, and return user data', async () => {
      // Arrange
      const req = {
        body: {
          email: 'john@example.com',
          password: 'password123'
        }
      } as Request;

      const res = {
        setHeader: jest.fn(),
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      // Mock user found from database with password field included
      const user = {
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CUSTOMER',
        password: 'hashedPassword'
      };

      // Chain mocks to simulate query with .select('+password')
      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(user)
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue('token');

      // Act
      await authService.login(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(generateToken).toHaveBeenCalledWith('123');
      expect(res.setHeader).toHaveBeenCalledWith('authorization', 'Bearer token');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CUSTOMER'
      });
    });

    it('should return 401 if user is not found', async () => {
      // Arrange
      const req = {
        body: {
          email: 'notfound@example.com',
          password: 'password123'
        }
      } as Request;

      const res = {
        setHeader: jest.fn(),
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      // Act
      await authService.login(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return 401 if password is invalid', async () => {
      // Arrange
      const req = {
        body: {
          email: 'john@example.com',
          password: 'wrongPassword'
        }
      } as Request;

      const res = {
        setHeader: jest.fn(),
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const user = {
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CUSTOMER',
        password: 'hashedPassword'
      };

      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(user)
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      await authService.login(req, res);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });
});
