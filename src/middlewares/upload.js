import s3 from '../config/s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

// multer 에 대한 설정값
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'tenshopbucket', // 객체를 업로드할 버킷 이름
    key: function (req, file, cb) {
      // 객체의 키로 고유한 식별자 이기 때문에 겹치면 안됨
      var filename = req.params.imageName;
      var ext = file.mimetype.split('/')[1];
      if (!['png', 'jpg', 'jpeg', 'gif', 'bmp'].includes(ext)) {
        return cb(new Error('Only images are allowed'));
      }
      cb(null, filename + '.jpg');
    },
  }),
  acl: 'public-read-write', // Access control for the file
});

export { upload };
