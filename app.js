const express = require('express')
//导入express，创建服务器实例
const app = express()

//导入cors中间件
const cors = require('cors')
app.use(cors())

//配置解析表单、json中间件
app.use(express.urlencoded({
  extended: false
}))
app.use(express.json());


//封装res.cc
app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    res.send({
      status,
      msg: err instanceof Error ? err.message : err
    })
  }
  next()
})

//配置解析token中间件
const expressJWT = require('express-jwt')
const config = require('./config')

app.use(expressJWT({
  secret: config.jwtSecretKey,
  algorithms: ['HS256']
}).unless({
  path: [/\/api/]
}))


//导入用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

//导入用户信息模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

//定义错误级别中间件
app.use((err, req, res, next) => {
  //身份认证错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')

  //未知的错误
  res.cc(err)
})

app.listen(1999, () => {
  console.log('api server running at http://127.0.0.1:1999');
})