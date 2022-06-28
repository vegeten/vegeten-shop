import { Router } from 'express';
import { imageUpload } from '../middlewares';

const imageRouter = Router();

// /api/images/upload
imageRouter.post('/upload', imageUpload.single('image'), async (req, res, next) => {
  try {
    // CloudFront 배포도메인주소 + 파일이름
    const imgurl = 'https://d2u1fvsvew9tft.cloudfront.net/image/' + req.file.key;

    res.status(201).json({
      status: 201,
      message: '이미지 저장 성공',
      imagePath: imgurl,
    });
  } catch (error) {
    next(error);
  }
});

export { imageRouter };
