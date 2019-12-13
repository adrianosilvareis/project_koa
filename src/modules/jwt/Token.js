const { sign, verify } = require('jsonwebtoken')

class Token {
  constructor(secretKey, signOptions, verifyOptions) {
    this._secretKey = secretKey
    this._signOptions = signOptions
    this._verifyOptions = verifyOptions
  }

  async sign(payload) {
    return sign(payload, this._secretKey, this._signOptions)
  }

  async verify(token) {
    return verify(token, this._secretKey, this._verifyOptions)
  }
}

module.exports = Token
