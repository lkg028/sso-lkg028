const Koa = require('koa')
const koaBody = require('koa-body')
const cors = require('@koa/cors')
const app = new Koa()

// 包装请求体
app.use(koaBody())

// 跨域
app.use(cors())

// 启动数据库
require('./plugins/AdminUserDB')

// 导入路由
app.use(require('./routes').routes())
app.use(require('./routes').allowedMethods())


// 启动应用
app.listen(3000)
console.log('服务启动了')