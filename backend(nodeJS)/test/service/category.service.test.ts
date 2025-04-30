import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import CategoryService from '../../src/service/category.service';
import Category from '../../src/model/category.model';

// Mock the Category model
jest.mock('../../src/model/category.model');

describe('CategoryService', () => {
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
        nextFunction.mockClear();
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

            (Category.create as jest.Mock).mockResolvedValue(mockCategory);

            const result = await CategoryService.createCategory(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction as unknown as NextFunction
            );

            expect(result).toEqual(mockCategory);
            expect(Category.create).toHaveBeenCalledWith({
                name: 'Test Category',
                description: 'Test Description',
            });
        });

        it('should handle errors when creating category', async () => {
            const mockError = new Error('Database error');
            mockRequest.body = {
                name: 'Test Category',
                description: 'Test Description',
            };

            (Category.create as jest.Mock).mockRejectedValue(mockError);

            try {
                await CategoryService.createCategory(
                    mockRequest as Request,
                    mockResponse as Response,
                    nextFunction as unknown as NextFunction
                );
            } catch (error) {
                // Error is expected to be handled by the service
            }

            expect(nextFunction).toHaveBeenCalledWith(mockError);
        });

        it('should handle empty request body', async () => {
            mockRequest.body = {};

            try {
                await CategoryService.createCategory(
                    mockRequest as Request,
                    mockResponse as Response,
                    nextFunction as unknown as NextFunction
                );
            } catch (error) {
                // Error is expected to be handled by the service
            }

            expect(Category.create).not.toHaveBeenCalled();
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

            (Category.find as jest.Mock).mockResolvedValue(mockCategories);

            const result = await CategoryService.getAllCategory(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction as unknown as NextFunction
            );

            expect(result).toEqual(mockCategories);
            expect(Category.find).toHaveBeenCalled();
        });

        it('should handle errors when fetching categories', async () => {
            const mockError = new Error('Database error');
            (Category.find as jest.Mock).mockRejectedValue(mockError);

            try {
                await CategoryService.getAllCategory(
                    mockRequest as Request,
                    mockResponse as Response,
                    nextFunction as unknown as NextFunction
                );
            } catch (error) {
                // Error is expected to be handled by the service
            }

            expect(nextFunction).toHaveBeenCalledWith(mockError);
        });

        it('should return empty array when no categories exist', async () => {
            (Category.find as jest.Mock).mockResolvedValue([]);

            const result = await CategoryService.getAllCategory(
                mockRequest as Request,
                mockResponse as Response,
                nextFunction as unknown as NextFunction
            );

            expect(result).toEqual([]);
            expect(Category.find).toHaveBeenCalled();
        });
    });
});
