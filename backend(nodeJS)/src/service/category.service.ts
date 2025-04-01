import { NextFunction, Request, Response } from "express";
import Category from "../model/category.model";

class CategoryService {
  public async createCategory(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { name, description } = req.body;

      // Validate required fields
      if (!name || !description) {
        throw new Error('Name and description are required');
      }

      const category = await Category.create({ name, description });
      return category;
    } catch (error) {
      next(error);
      return;
    }
  }

  public async getAllCategory(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const categories = await Category.find();
      return categories;
    } catch (error) {
      next(error);
      return;
    }
  }
}

export default new CategoryService();
