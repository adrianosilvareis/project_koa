const crypto = require('../../../lib')('crypto')

const { notFound, unauthorized } = require('boom')

class AuthController {
  constructor(UserModel) {
    this.UserModel = UserModel
  }

  async register(ctx, next) {
    try {
      const body = ctx.request.body
      const model = new this.UserModel(body)

      const result = await model.save({ new: true })

      // adicionar regexp para verificar se é production ou test
      if (ctx.mailer && process.env.NODE_ENV === 'production') {
        await ctx.mailer.sendMail({
          to: result.email,
          subject: 'active account',
          from: 'adriano@email.com.br',
          html: `<p>Seu cadastro esta quase completo, por favor, confirme seu cadastro: ${result.emailValidateToken}</p>`
        })
      }

      result.password = undefined

      ctx.body = result
    } catch (error) {
      ctx.throw(error)
    }
  }

  async activateAccount(ctx, next) {
    try {
      const { email, token } = ctx.request.body

      const user = await this.UserModel.findOne({ email }).select(
        '+emailValidateToken emailValidateExpires'
      )

      if (!user) throw notFound('User not found')

      if (token !== user.emailValidateToken) throw unauthorized('Token invalid')

      const now = new Date()

      if (now > user.emailValidateExpires)
        throw unauthorized('Token expired generate a new one')

      user.enable = true
      user.emailValidateExpires = undefined
      user.emailValidateToken = undefined

      ctx.body = 'OK'
    } catch (error) {
      ctx.throw(error)
    }
  }

  async forgotPassword(ctx, next) {
    try {
      const { email } = ctx.request.body

      const user = await this.UserModel.findOne({ email })

      if (!user) throw notFound('User not found')

      const token = crypto.randomizeToken()

      const now = new Date()
      now.setHours(now.getHours() + 1)

      await this.UserModel.findOneAndUpdate(user.id, {
        $set: {
          emailValidateToken: token,
          emailValidateExpires: now
        }
      })

      if (ctx.mailer && process.env.NODE_ENV === 'production') {
        await ctx.mailer.sendMail({
          to: email,
          from: 'adriano@email.com.br',
          subject: 'message',
          html: `<p>Renove sua senha com este token: ${token}</p>`
        })
      }

      ctx.body = 'OK'
    } catch (error) {
      ctx.throw(error)
    }
  }

  async resetPassword(ctx, next) {
    try {
      const { email, token, password } = ctx.request.body

      const user = await this.UserModel.findOne({ email }).select(
        '+emailValidateToken emailValidateExpires'
      )

      if (!user) throw notFound('User not found')

      if (token !== user.emailValidateToken) throw unauthorized('Token invalid')

      const now = new Date()

      if (now > user.emailValidateExpires)
        throw unauthorized('Token expired generate a new one')

      user.password = password
      user.emailValidateExpires = undefined
      user.emailValidateToken = undefined

      ctx.body = await user.save()
    } catch (error) {
      error.message = `Cannot reset password, try again: ${error.message}`
      ctx.throw(error)
    }
  }

  async authenticate(ctx, next) {
    try {
      const { email, password } = ctx.request.body

      if (!email || !password)
        throw unauthorized('invalid email or password', 'sample')

      const user = await this.UserModel.findOne({ email }).select('+password')

      if (!user) throw notFound(`User "${email}" Not Found`)

      if (!user.enable) throw unauthorized('user not enable', 'sample')

      const isMatch = await user.checkPassword(password)

      if (!isMatch) throw unauthorized('invalid password', 'sample')

      user.password = undefined

      const token = await ctx.token.sign({ _id: user.id })

      ctx.body = token
    } catch (error) {
      ctx.throw(error)
    }
  }
}

module.exports = AuthController
