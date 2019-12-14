const AdminUser = require('../plugins/AdminUserDB')
const jwt = require('jsonwebtoken')

// 验证登录，返回用户信息
module.exports =  async (token, secret) => {
    let jwtData = null
    let user = null
    if (token) {
      try {
        jwtData = jwt.verify(token, secret)
      } catch (err) {
        console.log('token解密错误：',err)
      }
      if( jwtData && jwtData.id)  user = await AdminUser.findById(jwtData.id)
    }
    return user
}