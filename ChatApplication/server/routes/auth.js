const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const imageUploadMiddleware = require('../middleware/imageUploadMiddleware')
const {valResult, checkRegUser, checkLoginUser } = require('../middleware/validationMiddleware')
const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware,auth.me)
router.post('/registration',imageUploadMiddleware,checkRegUser,valResult,auth.registration)
router.post('/login',checkLoginUser,valResult,auth.login)
router.post('/forgotLink',auth.forgotPassLink)
router.post('/forgotPassword',auth.forgotPassword)

module.exports = router;