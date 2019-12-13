const auth = require('./auth')
const jwt = require('./jwt')
const handles = require('./handles')
const mailer = require('./mail/mailer')

const modules = [auth, jwt, handles, mailer]

module.exports = app => {
  modules.forEach(lib => lib(app))
}
