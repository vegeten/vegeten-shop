import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { productService } from '../services';

const productRouter = Router();

// 전체 상품 목록을 가져옴
productRouter.get('/products', async function (req, res, next) {
  try {
    // 전체 상품 목록을 얻음
    const products = await productService.getProducts();

    // 상품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json({
      status: 200,
      message: '전체 상품 목록 조회 성공',
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

// 카테고리별 상품 목록을 가져옴
productRouter.get('/category/:category', async function (req, res, next) {
  try {
    // 카테고리별 상품 목록을 얻음
    const products = await productService.getCategoryProducts(req.params.category);

    // 상품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json({
      status: 200,
      message: '카테고리별 상품 목록 조회 성공',
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

// 특정 상품의 상세정보 조회
productRouter.get('/products/:productId', async function (req, res, next) {
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

// 상품등록 api (아래는 /product이지만, 실제로는 /api/product 로 요청해야 함.)
productRouter.post('/products', async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // req (request)의 body 에서 데이터 가져오기
    const productName = req.body.productName;
    const price = req.body.price;
    const description = req.body.description;
    const company = req.body.company;
    const category = req.body.category;
    const image = req.body.image;
    const detailImage = req.body.detailImage;

    // 위 데이터를 유저 db에 추가하기
    const newProduct = await productService.addProduct({
      productName,
      price,
      description,
      company,
      category,
      image,
      detailImage,
    });

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

// 상품 정보 수정
productRouter.patch('/products/:productId', async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // params로부터 id를 가져옴
    const productId = req.params.productId;

    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const productName = req.body.productName;
    const price = req.body.price;
    const description = req.body.description;
    const company = req.body.company;
    const category = req.body.category;
    const image = req.body.image;
    const detailImage = req.body.detailImage;

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(productName && { productName }),
      ...(price && { price }),
      ...(description && { description }),
      ...(company && { company }),
      ...(category && { category }),
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

// 상품 정보 삭제
productRouter.delete('/products/:productId', async function (req, res, next) {
  try {
    const productId = req.params.productId;
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
