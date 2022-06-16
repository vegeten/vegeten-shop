import { Router } from 'express';
import is from '@sindresorhus/is';
import { adminAuth } from '../middlewares';
import { productService } from '../services';
import * as product from '../controllers/product-controller';

const productRouter = Router();

// 상품 목록 조회 (/api/products)
productRouter.get('/', product.getAll);

// admin 상품 목록 조회 => admin 한정 (/api/products/admin)
productRouter.get('/admin', adminAuth, product.getAllAdmin);

// 상품 조회
productRouter.get('/:productId', product.getProduct);

// 상품 등록 ⇒ admin 한정
productRouter.post('/', adminAuth, product.create);

// 상품 수정 ⇒ admin 한정
productRouter.patch('/:productId', adminAuth, product.update);

// 상품 정보 삭제 ⇒ admin 한정
productRouter.delete('/:productId', adminAuth, product.deleteProduct);

export { productRouter };
