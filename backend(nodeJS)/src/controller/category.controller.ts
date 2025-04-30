import { NextFunction, Request, Response } from "express";
import CategoryService from "../service/category.service";

class CategoryController {
    async createCategory(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { name, description } = req.body;

            // Validate required fields
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Name is required',
                });
            }

            if (!description) {
                return res.status(400).json({
                    success: false,
                    message: 'Description is required',
                });
            }

            const category = await CategoryService.createCategory(req, res, next);
            if (!category) {
                return res.status(500).json({
                    success: false,
                    message: "Database error",
                });
            }
            return res.status(201).json(category);
        } catch (error: any) {
            console.error("Error creating category:", error.message);
            res.status(500).json({
                success: false,
                message: error.message || "Database error",
            });
            next(error);
        }
    }

    async getAllCategory(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const categories = await CategoryService.getAllCategory(req, res, next);
            if (!categories) {
                return res.status(500).json({
                    success: false,
                    message: "Database error",
                });
            }
            return res.status(200).json(categories);
        } catch (error: any) {
            console.error("Error fetching categories:", error.message);
            res.status(500).json({
                success: false,
                message: error.message || "Database error",
            });
            next(error);
        }
    }
}

export default new CategoryController();