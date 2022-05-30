import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { adminAuth } from '../middlewares';
import { userService, orderService, productService, categoryService } from '../services';
const adminRouter = Router();

/* -------------------------------USER------------------------------- */

// 전체 유저 목록을 가져옴 (배열 형태임)
adminRouter.get('/users', adminAuth, async function (req, res, next) {
  try {
    // 전체 사용자 목록을 얻음
    const users = await userService.getUsers();
    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json({
      status: 200,
      message: '전체 유저 목록 조회 성공',
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

// 특정 사용자 정보 조회
adminRouter.get('/users/:userId', adminAuth, async function (req, res, next) {
  try {
    // 특정 id에 맞는 사용자 정보를 얻음
    const user = await userService.getUser(req.params.userId);
    // 사용자 정보를 JSON 형태로 프론트에 보냄
    res.status(200).json({
      status: 200,
      message: '유저 정보 조회 성공',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/* ------------------------------PRODUCTS------------------------------ */

// 상품 목록 조회 api (/api/admin/products)
adminRouter.get('/products/productlist', adminAuth, async function (req, res, next) {
  try {
    // 페이지네이션
    // url 쿼리에서 page 받기, 기본값 1
    const page = Number(req.query.page || 1);
    // url 쿼리에서 peRage 받기, 기본값 10
    const perPage = Number(req.query.perPage || 9);

    // 전체 상품 목록을 얻음
    const { products, total, totalPage } = await productService.getProducts(page, perPage);

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

// 상품 조회 api (/api/products/:productId)
adminRouter.get('/products/:productId', adminAuth, async function (req, res, next) {
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

// 상품 등록 api (/api/admin/products)
adminRouter.post('/products', adminAuth, async (req, res, next) => {
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

// 상품 정보 수정 api (/api/products/:productId)
adminRouter.patch('/products/:productId', adminAuth, async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // params로부터 id를 가져옴
    const { productId } = req.params;
    // body data 로부터 업데이트할 사용자 정보를 추출함.
    const { productName, price, description, company, category, image, detailImage } = req.body;

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

// 상품 정보 삭제 api (/api/products/:productId)
adminRouter.delete('/products/:productId', adminAuth, async function (req, res, next) {
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

/* ------------------------------ORDERS------------------------------ */

// 전체 주문내역 조회
adminRouter.get('/orders', adminAuth, async (req, res, next) => {
  try {
    const orders = await orderService.getOrderlist();
    res.status(200).json({
      status: 200,
      message: '전체 주문 목록 조회 성공',
      data: orders,
    });
  } catch (err) {
    next(err);
  }
});

// 특정 주문 조회
adminRouter.get('/orders/:orderId', adminAuth, async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const order = await orderService.getOrder(orderId);
    res.status(200).json({
      status: 200,
      message: '주문번호 조회 성공',
      data: order,
    });
  } catch (err) {
    next(err);
  }
});

// 특정 주문 삭제
adminRouter.delete('/orders/:orderId', adminAuth, async function (req, res, next) {
  try {
    const orderId = req.params.orderId;
    // 특정 id에 맞는 주문 정보를 얻음
    const deleteOrder = await orderService.deleteOrder(orderId);
    console.log(deleteOrder);
    // 사용자 정보를 JSON 형태로 프론트에 보냄
    res.status(200).json({
      status: 200,
      message: '주문 내역 삭제 성공',
      data: {
        deleteOrder,
      },
    });
  } catch (error) {
    next(error);
  }
});

/* ------------------------------CATEGORIES------------------------------ */

// 카테고리 조회
adminRouter.get('/categories', adminAuth, async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    res.status(200).json({
      status: 200,
      message: '전체 카테고리 목록 조회 성공',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

// 카테고리 추가
adminRouter.post('/categories', adminAuth, async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    //req (request)의 body 데이터를 유저 db에 추가하기
    const newCategory = await categoryService.addCategory(req.body);

    // 추가된 상품의 db 데이터를 프론트에 다시 보내줌
    res.status(201).json({
      status: 201,
      message: '카테고리 추가 성공',
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
});

// 카테고리 수정
adminRouter.patch('/categories/:categoryId', adminAuth, async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // params로부터 id를 가져옴
    const { categoryId } = req.params;
    // body data 로부터 업데이트할 카테고리 정보를 추출함.
    const { category } = req.body;

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(category && { category }),
    };

    // 카테고리 정보를 업데이트함.
    const updatedCategoryInfo = await categoryService.setCategory(categoryId, toUpdate);

    // 업데이트 이후의 카테고리 데이터를 프론트에 보내 줌
    res.status(200).json({
      status: 200,
      message: '카테고리 정보 수정 성공',
      data: updatedCategoryInfo,
    });
  } catch (error) {
    next(error);
  }
});

// 카테고리 삭제 api (/api/categories/:categoryId)
adminRouter.delete('/categories/:categoryId', adminAuth, async function (req, res, next) {
  try {
    // params로부터 id를 가져옴
    const { categoryId } = req.params;
    // id에 맞는 카테고리를 삭제함
    const deleteCategory = await categoryService.deleteCategory(categoryId);

    res.status(200).json({
      status: 200,
      message: '카테고리 삭제 성공',
      data: {
        deleteCategory,
      },
    });
  } catch (error) {
    next(error);
  }
});

export { adminRouter };
