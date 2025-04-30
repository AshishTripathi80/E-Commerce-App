import { Request, Response, NextFunction } from "express";
import ProductService from "../service/product.service";
import { IProduct } from './../model/product.model';

class ProductController {
    createProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productData: IProduct = req.body;
            const product = await ProductService.createProduct(productData);
            res.status(201).json(product);
        }catch (error) {
            next(error);
        }
    }

    getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await ProductService.getAllProducts();
            res.status(200).json(products);
        }catch (error) {
            next(error);
        }
    }

    getProductById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} =req.params;
            const product = await ProductService.getProductById(id);
            if (!product){
                return res.status(404).json({message: 'Product not found'});
            }
            res.status(200).json(product);
        }catch (error){
            next(error);
        }
    }

    getProductByName = async (req: Request, res: Response, next:NextFunction) => {
        try {
            const {name} =req.params;
            const product = await ProductService.getProductByName(name);
            if (!product){
                return res.status(404).json({message: 'Product not found'});
            }
            res.status(200).json(product);
        }catch (error){
            next(error);
        }
    }

    updateProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const productData: Partial<IProduct> = req.body;

            const product = await ProductService.updateProduct(id, productData);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json(product);
        } catch (error: any) {
            if (error.message === 'Product not found') {
                return res.status(404).json({ message: 'Product not found' });
            }
            if (error.message === 'Category not found') {
                return res.status(404).json({ message: 'Category not found' });
            }
            next(error);
        }
    }

    deleteProduct = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const {id} =req.params;
            const result = await ProductService.deleteProduct(id);
            if (!result){
                return res.status(404).json({message: 'Product not found'});
            }
            res.status(200).json({message: 'Product deleted successfully'});
        }catch (error){ 
            next(error);
        }
    }    
}

export default new ProductController();