const UserModels = require('../models/user.models')
const AuthController = require('../controller/auth.controller')

const auth = new AuthController(UserModels)

const Router = require('koa-router')

const router = new Router({
  prefix: '/auth'
})

router
  .post('/register', (ctx, next) => auth.register(ctx, next))
  .post('/activate_account', (ctx, next) => auth.activateAccount(ctx, next))
  .post('/forgot_password', (ctx, next) => auth.forgotPassword(ctx, next))
  .post('/reset_password', (ctx, next) => auth.resetPassword(ctx, next))
  .post('/authenticate', (ctx, next) => auth.authenticate(ctx, next))

module.exports = app => {
  app.use(router.routes()).use(router.allowedMethods())
}
