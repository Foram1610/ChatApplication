const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const fileShareMiddleware = require('../middleware/fileShareMiddleware')
const message = require('../controllers/message.controller')

router.post('/',authMiddleware,message.sendMessage)
router.get('/:chatid',authMiddleware,message.fetchMessage)
router.post('/sendFiles',authMiddleware,fileShareMiddleware,message.sendFiles)
router.post('/replyMessage',authMiddleware,message.replyMessage)
router.get('/searchMessage',authMiddleware,message.searchMessage)

module.exports = router;