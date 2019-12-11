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

      ctx.mailer.sendMail({
        to: result.email,
        subject: 'active account',
        from: 'adriano@email.com.br',
        html: `<p>Seu cadastro esta quase completo, por favor, confirme seu cadastro: ${result.emailValidateToken}</p>`
      })

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

      if (new Date() > user.emailValidateExpires)
        throw unauthorized('Token expired generate a new one')

      user.enable = true
      user.emailValidateExpires = undefined
      user.emailValidateToken = undefined

      ctx.body = await user.save()
    } catch (error) {
      ctx.throw(error)
    }
  }

  async authenticate(ctx, next) {
    // try {
    // } catch (error) {}
  }

  async forgotPassword(ctx, next) {
    // try {
    // } catch (error) {}
  }
}

module.exports = AuthController
