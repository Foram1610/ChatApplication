const express = require('express');
const router = express.Router();
const chat = require('../controllers/chat.controller')
const authMiddleware = require('../middleware/authMiddleware');
const imageUploadMiddleware = require('../middleware/imageUploadMiddleware')

router.post('/',authMiddleware,chat.createChat)
router.get('/',authMiddleware,chat.fetchChat)
router.post('/createGroup',authMiddleware,imageUploadMiddleware,chat.createGroup)
router.put('/groupRename',authMiddleware,chat.groupRename)
router.put('/groupRemove',authMiddleware,chat.groupRemove)
router.put('/groupAdd',authMiddleware,chat.groupAdd)
router.put('/updateGroupImage',authMiddleware,imageUploadMiddleware,chat.updateGroupImage)

module.exports = router;