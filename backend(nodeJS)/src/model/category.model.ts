import mongoose from "mongoose";

export interface ICategory {
    name: string;
    description: string;
}

const categorySchema=new mongoose.Schema({
    name: { type: String, required:true},
    description: {type:String, required:true},
});

const Category=mongoose.model<ICategory>('Category',categorySchema);

export default Category;