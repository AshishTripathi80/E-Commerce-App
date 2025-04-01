import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import CategoryController from '../../src/controller/category.controller';
import CategoryService from '../../src/service/category.service';

// Mock CategoryService
jest.mock('../../src/service/category.service', () => ({
    createCategory: jest.fn(),
    getAllCategory: jest.fn(),
}));

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('Category Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        nextFunction = jest.fn();
        jest.clearAllMocks();
        mockConsoleLog.mockClear();
        mockConsoleError.mockClear();
    });

    afterAll(() => {
        mockConsoleLog.mockRestore();
        mockConsoleError.mockRestore();
    });

    describe('createCategory', () => {
        it('should create a new category successfully', async () => {
            const mockCategory = {
                name: 'Test Category',
                description: 'Test Description',
                _id: new mongoose.Types.ObjectId(),
            };

            mockRequest.body = {
                name: 'Test Category',
                description: 'Test Description',
            };

            (CategoryService.createCategory as jest.Mock).mockResolvedValue(mockCategory);

            await CategoryController.createCategory(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction as unknown as NextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCategory);
            expect(CategoryService.createCategory).toHaveBeenCalledWith(
                mockRequest,
                mockResponse,
                nextFunction
            );
        });

        it('should handle errors when creating category', async () => {
            const mockError = new Error('Database error');
            mockRequest.body = {
                name: 'Test Category',
                description: 'Test Description',
            };

            (CategoryService.createCategory as jest.Mock).mockRejectedValue(mockError);

            await CategoryController.createCategory(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction as unknown as NextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'Database error',
            });
            expect(mockConsoleError).toHaveBeenCalledWith(
                'Error creating category:',
                'Database error'
            );
        });

        it('should return 400 if name is missing', async () => {
            mockRequest.body = {
                description: 'Test Description',
            };

            await CategoryController.createCategory(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction as unknown as NextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'Name is required',
            });
        });

        it('should return 400 if description is missing', async () => {
            mockRequest.body = {
                name: 'Test Category',
            };

            await CategoryController.createCategory(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction as unknown as NextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'Description is required',
            });
        });
    });

    describe('getAllCategory', () => {
        it('should return all categories successfully', async () => {
            const mockCategories = [
                {
                    name: 'Category 1',
                    description: 'Description 1',
                    _id: new mongoose.Types.ObjectId(),
                },
                {
                    name: 'Category 2',
                    description: 'Description 2',
                    _id: new mongoose.Types.ObjectId(),
                },
            ];

            (CategoryService.getAllCategory as jest.Mock).mockResolvedValue(mockCategories);

            await CategoryController.getAllCategory(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction as unknown as NextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockCategories);
            expect(CategoryService.getAllCategory).toHaveBeenCalledWith(
                mockRequest,
                mockResponse,
                nextFunction
            );
        });

        it('should handle errors when fetching categories', async () => {
            const mockError = new Error('Database error');
            (CategoryService.getAllCategory as jest.Mock).mockRejectedValue(mockError);

            await CategoryController.getAllCategory(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction as unknown as NextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'Database error',
            });
            expect(mockConsoleError).toHaveBeenCalledWith(
                'Error fetching categories:',
                'Database error'
            );
        });
    });
}); 