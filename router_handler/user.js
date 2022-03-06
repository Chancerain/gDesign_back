//导入数据库操作模块
const db = require('../db/index')

//导入生成Token的包
const jwt = require('jsonwebtoken')
const config = require('../config')

//注册处理函数
exports.regUser = (req, res) => {
  const userinfo = req.body

  //合法性校验
  if (!userinfo.username || !userinfo.password) {
    return res.cc('用户名或密码不合法')
  }

  //查询用户是否被占用
  const sqlStr = 'select * from user where username=?'
  db.query(sqlStr, userinfo.username, (err, results) => {
    if (err) {
      return res.cc(err)
    }

    if (results.length > 0) {
      return res.cc('用户名已被占用')
    }

    //创建新用户
    const sql = 'insert into user set ?'
    db.query(sql, {
      ...userinfo
    }, (err, results) => {
      if (err) return res.cc(err)

      if (results.affectedRows !== 1) {
        return res.cc('注册用户失败')
      }

      res.cc('注册成功！', 0)
    })

  })

}

//登录处理函数
exports.login = (req, res) => {
  const userinfo = req.body

  const sql = 'select * from user where username=?'

  //根据用户名查询用户信息
  db.query(sql, userinfo.username, (err, results) => {
    if (err) return res.cc(err)

    //用户名不存在
    if (results.length !== 1) return res.cc('登录失败！')

    //密码错误
    if (userinfo.password !== results[0].password) {
      return res.cc('登录失败！')
    }

    const user = {
      ...results[0],
      password: ''
    }

    //对用户信息进行加密，生成Token字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn
    })

    //将Token响应给客户端
    res.send({
      status: 0,
      msg: '登录成功！',
      token: 'Bearer ' + tokenStr
    })
  })
}