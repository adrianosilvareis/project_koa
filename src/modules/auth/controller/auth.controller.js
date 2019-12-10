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

  async authenticate(ctx, next) {
    // try {
    // } catch (error) {}
  }

  async forgotPassword(ctx, next) {
    // try {
    // } catch (error) {}
  }

  async activateAccount(ctx, next) {
    // try {
    // } catch (error) {}
  }
}

module.exports = AuthController
