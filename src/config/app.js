const bodyParser = require('koa-bodyparser')
const helmet = require('koa-helmet')
const Koa = require('koa')
const modules = require('../modules')
const app = new Koa()

app.use(bodyParser())
app.use(helmet())

modules(app)

module.exports = app
