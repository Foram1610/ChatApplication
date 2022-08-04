const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/ProfilePicture');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({
    storage: storage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|webp)$/)) {
            return cb(new Error(('Please upload image only!!')),false)
        }
        cb(undefined, true)
    }
}).single('dp');

module.exports = upload