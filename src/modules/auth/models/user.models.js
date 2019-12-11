const { genSalt, hash, compare } = require('bcryptjs')
const { boomify } = require('boom')
const crypto = require('crypto')
const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = Schema(
  {
    name: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      select: false,
      minlength: [8, 'Your password must be at least 8 characters'],
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(v) {
          return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g.test(v)
        },
        message: props => `${props.value} is not a valid e-mail!`
      }
    },
    emailValidateToken: {
      type: String,
      select: false
    },
    emailValidateExpires: {
      type: Date,
      select: false
    },
    accessNumber: {
      type: Number,
      default: 1
    },
    enable: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

schema.methods = {
  async checkPassword(candidatePassword) {
    return compare(candidatePassword, this.password)
  }
}

schema.pre('save', async function(next) {
  try {
    if (this.password) {
      const salt = await genSalt(10)
      this.password = await hash(this.password, salt)
    }
    if (!this.isNew) return next()
    const token = crypto.randomBytes(20).toString('hex')
    const now = new Date()
    now.setHours(now.getHours() + 1)
    this.emailValidateToken = token
    this.emailValidateExpires = now

    return next()
  } catch (error) {
    throw boomify(error)
  }
})

schema.plugin(uniqueValidator)

module.exports = model('User', schema)
