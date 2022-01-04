import path from 'path';
import multer from 'multer';
import fs from 'fs';
// create avatar multer
var storageAvatar = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'localdata/product_avatar');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
export const uploadAvatar = multer({ storage: storageAvatar });

// create multer
var storageImage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(`localdata/product_image/${req.params.id}`)) {
            fs.mkdir(`localdata/product_image/${req.params.id}`, { recursive: true }, (err) => {
                if (err){
                    console.log('Can\'t create directory');
                }
            });
        }
        cb(null, `localdata/product_image/${req.params.id}`);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
export const uploadImage = multer({ storage: storageImage });