const Router = require('koa-router')
const template = require('art-template')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const AdminUserModel = require('../plugins/AdminUserDB')
const router = new Router()
const fs = require('fs')
const SECRET = '!%#$!%^fa888'
const Domain = ''  // domian=.lkg028.cn   // 设置cookie的域
const redirectAlt = 'https://lkg028.cn'   // 没有referer的默认重定向到主站首页

// GET登录页面
router.get('/', async ctx => {
  const token = ctx.cookies.get('jwt')
  let html = fs.createReadStream(__dirname + '/template/index.html')
  // let success = false
  if (token) {
    let res = await require('./auth')(token, SECRET)
    if (res) html = template(__dirname + '/template/success.art', {redirectAlt})
  }
  ctx.type = 'text/html;charset=utf-8'
  ctx.body = html
})

// POST：接收用户表单，派发jwt到cookie中
router.post('/', async (ctx, next) => {
  const { username, password} = ctx.request.body
  let user = null
  let msg = ''
  let html = ''
  if (!username || !password) {
    msg = '用户名/密码不能为空'
  } else {
    // 1.找用户
    user = await AdminUserModel.findOne({username}).select('+password')
    if (!user) { 
      msg = '用户名错误' 
    } else {
    // 2.校验
      const isValid = bcrypt.compareSync(password, user.password)
      if (!isValid) { msg += ' 密码错误' }
    }
  }
  // 3.验证成功后设置token到cookie中，重定向到之前的页面
  if (!msg) {
    const token = jwt.sign({id: user._id}, SECRET)
    ctx.set('Set-Cookie', `jwt=${token}; HttpOnly; max-age=43200000;`)
    html = template(__dirname + '/template/success.art', {redirectAlt})
  } else {
    html = template(__dirname + '/template/error.art', {msg})
  }
  ctx.body = html
})

// POST: 获取用户信息
router.post('/user', async ctx => {
  let {jwt: token} = ctx.request.body
  let userInfo = await require('./auth')(token, SECRET)
  if (userInfo) {
    ctx.body = userInfo
  } else {
    ctx.status = 401
    ctx.body = { massage: '认证失败' }
  }
})

module.exports = router