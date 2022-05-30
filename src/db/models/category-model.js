import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';
const Category = model('categories', CategorySchema);

export class CategoryModel {
  async findByCategory(categoryName) {
    return await Category.findOne({ label: categoryName });
  }
  async findAll() {
    return await Category.find({});
  }

  async findById(categoryId) {
    return await Category.findOne({ shortId: categoryId });
  }

  async create(CategoryInfo) {
    return await Category.create(CategoryInfo);
  }

  async update({ categoryId, update }) {
    const option = { returnOriginal: false };
    return await Category.findOneAndUpdate({ shortId: categoryId }, update, option);
  }

  async delete(categoryId) {
    return await Category.findOneAndDelete({ shortId: categoryId });
  }
}

const categoryModel = new CategoryModel();
export { categoryModel };
