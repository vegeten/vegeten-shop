import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { adminAuth } from '../middlewares';
import { productService } from '../services';

const productRouter = Router();

// 상품 목록 조회 (/api/products)
productRouter.get('/', async function (req, res, next) {
  try {
    // 페이지네이션
    // url 쿼리에서 page 받기, 기본값 1
    const page = Number(req.query.page || 1);
    // url 쿼리에서 peRage 받기, 기본값 10
    const perPage = Number(req.query.perPage || 9);

    // 전체 상품 목록을 얻음
    let products = await productService.getProducts();

    // 페이지네이션
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

    // 상품 목록(배열)을 JSON 형태로 프론트에 보냄
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

productRouter.get('/admin', async function (req, res, next) {
  try {
    // 페이지네이션
    // url 쿼리에서 page 받기, 기본값 1
    const page = Number(req.query.page || 1);
    // url 쿼리에서 peRage 받기, 기본값 10
    const perPage = Number(req.query.perPage || 9);

    // 전체 상품 목록을 얻음
    let products = await productService.getProducts();

    // 페이지네이션
    const productsPerPage = products.slice(perPage * (page - 1), perPage * (page - 1) + perPage);
    const total = products.length;
    const totalPage = Math.ceil(total / perPage);
    products = productsPerPage;

    // 상품 목록(배열)을 JSON 형태로 프론트에 보냄
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

// 상품 조회 (/api/products/:productId)
productRouter.get('/:productId', async function (req, res, next) {
  try {
    // 특정 id에 맞는 상품 상세정보를 얻음
    const product = await productService.getProduct(req.params.productId);
    // 상품상세정보를 JSON 형태로 프론트에 보냄
    res.status(200).json({
      status: 200,
      message: '상품 정보 조회 성공',
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

// 상품 등록 (/api/products) ⇒ admin 한정
productRouter.post('/', adminAuth, async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    //req (request)의 body 데이터를 유저 db에 추가하기
    const newProduct = await productService.addProduct(req.body);

    // 추가된 상품의 db 데이터를 프론트에 다시 보내줌
    res.status(201).json({
      status: 201,
      message: '상품 등록 성공',
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
});

// 상품 정보 수정 (/api/products/:productId) ⇒ admin 한정
productRouter.patch('/:productId', adminAuth, async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // params로부터 id를 가져옴
    const { productId } = req.params;
    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const { productName, price, description, company, categoryId, image, detailImage } = req.body;

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(productName && { productName }),
      ...(price && { price }),
      ...(description && { description }),
      ...(company && { company }),
      ...(categoryId && { categoryId }),
      ...(image && { image }),
      ...(detailImage && { detailImage }),
    };

    // 상품 정보를 업데이트함.
    const updatedProductInfo = await productService.setProduct(productId, toUpdate);

    // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
    res.status(200).json({
      status: 200,
      message: '상품 정보 수정 성공',
      data: updatedProductInfo,
    });
  } catch (error) {
    next(error);
  }
});

// 상품 정보 삭제 (/api/products/:productId) ⇒ admin 한정
productRouter.delete('/:productId', adminAuth, async function (req, res, next) {
  try {
    // params로부터 id를 가져옴
    const { productId } = req.params;
    // id에 맞는 상품을 삭제함
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
