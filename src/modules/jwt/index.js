const { signOptions, verifyOptions } = require('../../config/jwt.json')

const jwt = require('koa-jwt')
const Token = require('./Token')

module.exports = app => {
  app.use(
    jwt({ secret: process.env.JWT_SECRETY }).unless({ path: [/^\/auth/] })
  )

  app.context.token = new Token(
    process.env.JWT_SECRETY,
    signOptions,
    verifyOptions
  )
}
