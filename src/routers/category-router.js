import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { categoryService } from '../services';

const categoryRouter = Router();

// 카테고리 추가 api (아래는 /categories지만, 실제로는 /api/categories 로 요청해야 함.)
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

export { categoryRouter };
