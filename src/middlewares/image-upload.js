// import multerS3 from 'multer-s3';
// import multer from 'multer';
// import aws from 'aws-sdk';

import { s3 } from '../db/s3';
import multerS3 from 'multer-s3';
import multer from 'multer';

const imageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'tenshopbucket/image',
    key: function (req, file, cb) {
      // 확장자가 이미지 파일이 아닐 경우 에러처리
      const extension = file.mimetype.split('/')[1];
      if (!['png', 'jpg', 'jpeg', 'gif', 'bmp'].includes(extension)) {
        return cb(new Error('이미지 파일을 등록해주세요.'));
      }

      // 파일(객체) 이름 : 현재시각_유저가업로드한파일이름.이미지확장자
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
  acl: 'public-read-write', // 읽고 쓰는 권한
});

export { imageUpload };
