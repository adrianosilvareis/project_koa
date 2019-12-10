const auth = require('./auth')
const handles = require('./handles')
const mailer = require('./mail/mailer')

const modules = [auth, handles, mailer]

module.exports = app => {
  modules.forEach(lib => lib(app))
}
