import Product, { IProduct } from "../model/product.model";
import Category from "../model/category.model";

class ProductService {
    async createProduct(productData: IProduct): Promise<IProduct> {
        // Verify that the category exists
        const category = await Category.findById(productData.category);
        if (!category) {
            throw new Error('Category not found');
        }

        // Create the product with the category ID
        const product = await Product.create(productData);
        return product;
    }
    async getAllProducts(): Promise<IProduct[]> {
        const products =await Product.find().populate('category');
        return products;
    }

    async getProductById(id: string): Promise<IProduct | null> {
        const product =await Product.findById(id).populate('category');
        return product;
    }

    async getProductByName(name: string): Promise<IProduct | null> {
        const product =await Product.findOne({name});
        return product;
    }

    async updateProduct(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
        // First check if product exists
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            throw new Error('Product not found');
        }

        // If category is being updated, verify it exists
        if (productData.category) {
            const category = await Category.findById(productData.category);
            if (!category) {
                throw new Error('Category not found');
            }
        }

        // Update the product
        const product = await Product.findByIdAndUpdate(
            id,
            { $set: productData },
            { new: true, runValidators: true }
        );
        return product;
    }

    async deleteProduct(id: string): Promise<boolean> {
        const result =await Product.findByIdAndDelete(id);
        return result !== null;
    }
}

export default new ProductService();