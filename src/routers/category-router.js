import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { adminAuth } from '../middlewares';
import * as categoryController from '../controllers/category-controller';

const categoryRouter = Router();

// 카테고리 조회 (/api/categories/)
categoryRouter.get('/', categoryController.getCategories);

// 카테고리 추가 (api/categories) ⇒ admin 한정
categoryRouter.post('/', adminAuth, categoryController.createCategory);

// 카테고리 수정 (/api/categories/:categoryId) ⇒ admin 한정
categoryRouter.patch('/:categoryId', adminAuth, categoryController.updateCategory);

// 카테고리 삭제 (/api/categories/:categoryId) ⇒ admin 한정
categoryRouter.delete('/:categoryId', adminAuth, categoryController.deleteCategory);

// 카테고리별 상품 목록 (/api/categories/products/:categoryId/)
categoryRouter.get('/products/:categoryId', categoryController.getProductsByCategory);

export { categoryRouter };
