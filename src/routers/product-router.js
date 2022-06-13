import { Router } from 'express';
import is from '@sindresorhus/is';
import { adminAuth } from '../middlewares';
import { productService } from '../services';

const productRouter = Router();

// 상품 목록 조회 (/api/products)
productRouter.get('/', async function (req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 9);

    let products = await productService.getProducts();

    let arr = [];
    for (let i = 0; i < products.length; i++) {
      if (products[i].categoryId.active === 'active') {
        arr.push(products[i]);
      }
    }
    const productsPerPage = arr.slice(perPage * (page - 1), perPage * (page - 1) + perPage);
    const total = arr.length;
    const totalPage = Math.ceil(total / perPage);
    products = productsPerPage;
    res.status(200).json({
      status: 200,
      message: '전체 상품 목록 조회 성공',
      data: {
        totalPage: totalPage,
        productCount: total,
        products,
      },
    });
  } catch (error) {
    next(error);
  }
});

// admin 상품 목록 조회 => admin 한정
productRouter.get('/admin', adminAuth, async function (req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 9);

    let products = await productService.getProducts();

    const productsPerPage = products.slice(perPage * (page - 1), perPage * (page - 1) + perPage);
    const total = products.length;
    const totalPage = Math.ceil(total / perPage);
    products = productsPerPage;

    res.status(200).json({
      status: 200,
      message: '전체 상품 목록 조회 성공',
      data: {
        totalPage: totalPage,
        productCount: total,
        products,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 상품 조회
productRouter.get('/:productId', async function (req, res, next) {
  try {
    const product = await productService.getProduct(req.params.productId);
    res.status(200).json({
      status: 200,
      message: '상품 정보 조회 성공',
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// 상품 등록 ⇒ admin 한정
productRouter.post('/', adminAuth, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    const newProduct = await productService.addProduct(req.body);

    res.status(201).json({
      status: 201,
      message: '상품 등록 성공',
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
});
// 상품 수정 ⇒ admin 한정
productRouter.patch('/:productId', adminAuth, async function (req, res, next) {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    const { productId } = req.params;
    const { productName, price, description, company, categoryId, image, detailImage, quantity } = req.body;

    const toUpdate = {
      ...(productName && { productName }),
      ...(price && { price }),
      ...(description && { description }),
      ...(company && { company }),
      ...(categoryId && { categoryId }),
      ...(image && { image }),
      ...(detailImage && { detailImage }),
      ...(quantity && { quantity }),
    };

    const updatedProductInfo = await productService.setProduct(productId, toUpdate);

    res.status(200).json({
      status: 200,
      message: '상품 정보 수정 성공',
      data: updatedProductInfo,
    });
  } catch (error) {
    next(error);
  }
});

// 상품 정보 삭제 ⇒ admin 한정
productRouter.delete('/:productId', adminAuth, async function (req, res, next) {
  try {
    const { productId } = req.params;
    const deleteProduct = await productService.deleteProduct(productId);

    res.status(200).json({
      status: 200,
      message: '상품 삭제 성공',
      data: {
        deleteProduct,
      },
    });
  } catch (error) {
    next(error);
  }
});

export { productRouter };
