import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { categoryService } from '../services';

const categoryRouter = Router();

// 카테고리 추가 api (아래는 /categories지만, 실제로는 /api/categories 로 요청해야 함.)
categoryRouter.get('/categories', async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    console.log(categories);
    res.status(200).json({
      statusCode: 200,
      message: '전체 카테고리 목록 조회 성공',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

categoryRouter.post('/categories', async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // req (request)의 body 에서 데이터 가져오기
    const category = req.body.category;

    // 위 데이터를 유저 db에 추가하기
    const newCategory = await categoryService.addCategory({
      category,
    });

    // 추가된 상품의 db 데이터를 프론트에 다시 보내줌
    res.status(201).json({
      statusCode: 201,
      message: '카테고리 추가 성공',
      data: newCategory,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message || 'Some error occured while creating th Category.',
    });
  }
});

categoryRouter.patch('/categories/:categoryId', async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }

    // params로부터 id를 가져옴
    const categoryId = req.params.categoryId;

    // body data 로부터 업데이트할 카테고리 정보를 추출함.
    const category = req.body.category;

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(category && { category }),
    };

    // 카테고리 정보를 업데이트함.
    const updatedCategoryInfo = await categoryService.setCategory(categoryId, toUpdate);

    // 업데이트 이후의 카테고리 데이터를 프론트에 보내 줌
    res.status(200).json({
      statusCode: 200,
      message: '카테고리 정보 수정 성공',
      data: updatedCategoryInfo,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message || 'Some error occurred while retrieving category.',
    });
    next(error);
  }
});

categoryRouter.delete('/categories/:categoryId', async function (req, res, next) {
  try {
    const categoryId = req.params.categoryId;
    // id에 맞는 카테고리를 삭제함
    const deleteCategory = await categoryService.deleteCategory(categoryId);

    res.status(200).json({
      statusCode: 200,
      message: '카테고리 삭제 성공',
      data: {
        deleteCategory,
      },
    });
  } catch (error) {
    next(error);
  }
});

export { categoryRouter };
