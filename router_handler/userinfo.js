//导入数据库操作模块
const db = require('../db/index')

//获取用户信息
exports.getUserInfo = (req, res) => {
  const sql = 'select * from user where uid=?'

  db.query(sql, req.user.uid, (err, results) => {
    console.log(req.user.uid);
    if (err) return res.cc(err)

    if (results.length !== 1) return res.cc('获取用户信息失败！')

    //返回客户信息
    res.send({
      status: 0,
      msg: '获取用户信息成功！',
      data: results[0]
    })
    console.log(results);
  })
}

//更新用户信息
exports.updateUserInfo = (req, res) => {
  const sql = 'update user set ? where uid=?'
  db.query(sql, [req.body, req.user.uid], (err, results) => {
    if (err) return res.cc(err)

    if (results.affectedRows !== 1) return res.cc('修改用户信息失败！')

    return res.cc('修改用户基本信息成功！', 0)
  })
}

//修改密码
exports.updatePwd = (req, res) => {

  const sql = "select password from user where uid=?"
  //查询旧密码
  db.query(sql, req.user.uid, (err, results) => {
    if (err) return res.cc(err)

    if (results.length !== 1) return res.cc(err)

    //判断新旧密码是否相同
    if (req.body.password === results[0].password) return res.cc('当前密码与旧密码相同！')
    else {
      const sql = 'update user set password=? where uid=?'

      //修改密码
      db.query(sql, [req.body.password, req.user.uid], (err, results) => {
        if (err) return res.cc(err)

        if (results.affectedRows !== 1) return res.cc('修改密码失败！')

        return res.cc('修改密码成功！', 0)
      })
    }

  })

}