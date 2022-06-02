import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { adminAuth } from '../middlewares';
import { categoryService, productService } from '../services';

const categoryRouter = Router();

// 카테고리 조회 (/api/categories/)
categoryRouter.get('/', async (req, res, next) => {
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

// 카테고리 추가 (api/categories) ⇒ admin 한정
categoryRouter.post('/', adminAuth, async (req, res, next) => {
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

// 카테고리 수정 (/api/categories/:categoryId) ⇒ admin 한정
categoryRouter.patch('/:categoryId', adminAuth, async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // params로부터 id를 가져옴
    const { categoryId } = req.params;
    // body data 로부터 업데이트할 카테고리 정보를 추출함.
    const { label, active } = req.body;
    console.log(active);
    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(active && { active }),
      ...(label && { label }),
    };

    // 카테고리 정보를 업데이트함.
    const updatedCategoryInfo = await categoryService.setCategory(categoryId, toUpdate);

    // 업데이트 이후의 카테고리 데이터를 프론트에 보내 줌
    res.status(200).json({
      status: 200,
      message: '카테고리 이름 수정 성공',
      data: updatedCategoryInfo,
    });
  } catch (error) {
    next(error);
  }
});

// 카테고리 삭제 (/api/categories/:categoryId) ⇒ admin 한정
categoryRouter.delete('/:categoryId', adminAuth, async function (req, res, next) {
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

// 카테고리별 상품 목록 (/api/categories/products/:categoryId/)
categoryRouter.get('/products/:categoryId', async function (req, res, next) {
  try {
    // 페이지네이션
    // url 쿼리에서 page 받기, 기본값 1
    const page = Number(req.query.page || 1);
    // url 쿼리에서 peRage 받기, 기본값 10
    const perPage = Number(req.query.perPage || 9);

    // 카테고리별 상품 목록을 얻음
    const { products, total, totalPage } = await productService.getCategoryProducts(
      req.params.categoryId,
      page,
      perPage
    );

    // 상품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json({
      status: 200,
      message: '카테고리별 상품 목록 조회 성공',
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

export { categoryRouter };
