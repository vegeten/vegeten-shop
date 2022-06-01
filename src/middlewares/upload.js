//upload.js
import multerS3 from 'multer-s3';
import multer from 'multer';
import aws from 'aws-sdk';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'tenshopbucket',
    key: function (req, file, cb) {
      var filename = req.params.imageName;
      var ext = file.mimetype.split('/')[1];
      if (!['png', 'jpg', 'jpeg', 'gif', 'bmp'].includes(ext)) {
        return cb(new Error('Only images are allowed'));
      }
      cb(null, filename + '.jpg');
    },
  }),
  acl: 'public-read-write',
});

export { upload };
