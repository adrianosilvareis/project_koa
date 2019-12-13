const { genSalt, hash, compare } = require('bcryptjs')
const crypto = require('crypto')

module.exports = {
  async encryptedPassword(password) {
    const salt = await genSalt(10)
    return hash(password, salt)
  },
  async decryptedPassword(candidatePassword, encodedPassword) {
    return compare(candidatePassword, encodedPassword)
  },
  randomizeToken() {
    return crypto.randomBytes(20).toString('hex')
  }
}
