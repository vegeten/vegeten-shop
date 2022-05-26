import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';
const Category = model('categories', CategorySchema);

export class CategoryModel {
  async findByCategory(categoryName) {
    const category = await Category.findOne({ category: categoryName });
    return category;
  }
  async findAll() {
    const categories = await Category.find({});
    return categories;
  }

  async findById(categoryId) {
    const category = await Category.findOne({ _id: categoryId });
    return category;
  }

  async create(CategoryInfo) {
    const createdNewCategory = await Category.create(CategoryInfo);
    return createdNewCategory;
  }

  async update({ categoryId, update }) {
    const filter = { _id: categoryId };
    const option = { returnOriginal: false };
    const updatedCategory = await Category.findOneAndUpdate(filter, update, option);
    return updatedCategory;
  }

  async delete(categoryId) {
    return await Category.findOneAndDelete({ _id: categoryId });
  }
}

const categoryModel = new CategoryModel();
export { categoryModel };
