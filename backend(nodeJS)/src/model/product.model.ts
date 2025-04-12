import mongoose from "mongoose";

export interface IProduct {
    name: string;
    description: string;
    price: number;
    category: mongoose.Types.ObjectId;
    image: string;
}

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
    image: {type: String, required: true},
});

const Product = mongoose.model('Product', productSchema);

export default Product;