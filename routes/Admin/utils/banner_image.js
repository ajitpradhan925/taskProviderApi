
const aws = require('aws-sdk');
const multers3 = require('multer-s3')
const multer = require('multer');


aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS,
    accessKeyId: process.env.AWS_ACESS_KEY,
    region:"ap-south-1"
})

var s3 = new aws.S3();
  

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//       cb(null, './uploads/');
//     },
//     filename: function(req, file, cb) {
//       cb(null,file.originalname);
//     }
//   });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, new Error('Only JPEG and Png are allowed'));
    }
  };
  

  const upload = multer({
      fileFilter,
    storage: multers3({
        s3: s3,
        bucket: 'banner-images-smart-work',
        acl: 'public-read',
        metadata: function(req, file, cb) {
            cb(null, {filedName: 'TASK_META_DATA'});
        },
        key: function(req, file, cb) {
            cb(null, file.originalname)
        }
    })
  });
  
  module.exports = upload;