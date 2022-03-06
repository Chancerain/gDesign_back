const express = require('express')
const router = express.Router()

const userinfo_handler = require('../router_handler/userinfo')

//获取用户基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)
//修改用户信息
router.post('/userinfo', userinfo_handler.updateUserInfo)
//修改密码
router.post('/updatepwd', userinfo_handler.updatePwd)

module.exports = router