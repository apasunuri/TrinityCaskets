const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || require('./config').aws.accessKeyId,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || require('./config').aws.secretAccessKey,
    Bucket: process.env.AWS_BUCKET || require('./config').aws.Bucket
});

const imageUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET || require('./config').aws.Bucket,
        acl: 'public-read',
        key: function(req, fileName,cb) {
            cb(null, path.basename(fileName.originalname, path.extname(fileName.originalname)) + path.extname(fileName.originalname))
        }
    }),
    limits: {fileSize: 2000000},
    fileFilter: function(req, fileName, cb) {
        checkFileType(fileName, cb);
    }
}).single('image');

function checkFileType(fileName, cb) {
    const fileType = /jpeg|jpg|gif|png/;
    const extensionName = fileType.test(path.extname(fileName.originalname).toLowerCase());
    const mimeType = fileType.test(fileName.mimetype);
    if(mimeType && extensionName) {
        return cb(null, true);
    }
    else {
        cb('Error: Invalid File Upload');
    }
}

exports.create = function(req, res) {
    imageUpload(req, res, (error) => {
        if(error) {
            res.json({error: error});
        }
        else {
            if(req.file === undefined) {
                res.json('Error: No File Selected');
            }
            else {
                const name = req.file.key;
                const location = req.file.location;
                res.json({
                    image: name,
                    location: location
                });
            }
        }
    })
}