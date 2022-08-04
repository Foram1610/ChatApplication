const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userInfo = require('../controllers/usersInfo.controller')
const imageUploadMiddleware = require('../middleware/imageUploadMiddleware')

router.put('/updateDetails',authMiddleware,userInfo.updateDetails)
router.put('/updateImage',authMiddleware,imageUploadMiddleware,userInfo.updateImage)
router.put('/changePassword',authMiddleware,userInfo.changePassword)
router.get('/serachUsers',authMiddleware,userInfo.serachUsers)

module.exports = router