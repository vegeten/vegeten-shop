import { categoryModel } from '../db';

class CategoryService {
  // 본 파일의 맨 아래에서, new CategoryService(categoryModel) 하면, 이 함수의 인자로 전달됨
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  async getCategories() {
    const categories = await this.categoryModel.findAll();

    return categories;
  }

  // 카테고리 추가
  async addCategory(categoryInfo) {
    // 객체 destructuring
    const { category } = categoryInfo;

    // 카테고리 중복 확인
    const categoryName = await this.categoryModel.findByCategory(category);
    if (categoryName) {
      const e = new Error('이미 있는 카테고리입니다. 다른 이름으로 등록해주세요.');
      e.status = 409;
      throw e;
    }

    const newCategoryInfo = {
      category,
    };
    // db에 저장
    const createdNewCategory = await this.categoryModel.create(newCategoryInfo);

    return createdNewCategory;
  }

  // 카테고리 수정
  async setCategory(categoryId, toUpdate) {
    let category = await this.categoryModel.findById(categoryId);
    if (!category) {
      const e = new Error('해당 카테고리의 id가 없습니다. 다시 한 번 확인해 주세요.');
      e.status = 404;
      throw e;
    }

    // 카테고리 중복 확인
    const categoryName = await this.categoryModel.findByCategory(toUpdate.category);
    if (categoryName) {
      const e = new Error('이미 있는 카테고리입니다. 다른 이름으로 등록해주세요.');
      e.status = 409;
      throw e;
    }

    category = await this.categoryModel.update({
      categoryId,
      update: toUpdate,
    });

    return category;
  }
  // 카테고리 삭제
  async deleteCategory(categoryId) {
    let category = await categoryModel.delete(categoryId);
    if (!category) {
      const e = new Error('해당 카테고리의 id가 없습니다. 다시 한 번 확인해 주세요.');
      e.status = 404;
      throw e;
    }

    return category;
  }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };
