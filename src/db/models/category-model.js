import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';
const Category = model('categories', CategorySchema);

export class CategoryModel {
  async create(CategoryInfo) {
    const createdNewCategory = await Category.create(CategoryInfo);
    return createdNewCategory;
  }
}

const categoryModel = new CategoryModel();
export { categoryModel };
