import { Router } from 'express';
import { adminAuth } from '../middlewares';
import * as productController from '../controllers/product-controller';

const productRouter = Router();

// 상품 목록 조회 (/api/products)
productRouter.get('/', productController.getProducts);

// admin 상품 목록 조회 => admin 한정 (/api/products/admin)
productRouter.get('/admin', adminAuth, productController.getProductsAdmin);

// 상품 조회
productRouter.get('/:productId', productController.getProduct);

// 상품 등록 ⇒ admin 한정
productRouter.post('/', adminAuth, productController.createProduct);

// 상품 수정 ⇒ admin 한정
productRouter.patch('/:productId', adminAuth, productController.updateProduct);

// 상품 정보 삭제 ⇒ admin 한정
productRouter.delete('/:productId', adminAuth, productController.deleteProduct);

export { productRouter };
