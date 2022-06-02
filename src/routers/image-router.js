import { Router } from 'express';
import { imageUpload } from '../middlewares';

const imageRouter = Router();

// /api/images/upload
imageRouter.post('/upload', imageUpload.single('image'), async (req, res, next) => {
  try {
    // req.file : 저장된 이미지의 메타데이터를 받는 객체
    console.log(req.file);

    // req.file.location : req.file 객체 속성 중 s3 버킷에 저장된 이미지 파일의 경로(이미지 주소) 가 전달되는 키
    // 이 경로를 db에 저장하고 서버가 이 이미지 주소를 응답하면 클라이언트에서 이 이미지를 핸들링 할 수 있게 됨.
    console.log(req.file.location);

    // req.file에서 이미지 경로를 가져와 프론트에게 경로 반환
    res.status(201).json({
      status: 201,
      message: '이미지 저장 성공',
      imagePath: req.file.location,
    });
  } catch (error) {
    next(error);
  }
});

export { imageRouter };
