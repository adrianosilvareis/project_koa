const fs = require('fs')
const path = require('path')

module.exports = app => {
  fs.readdirSync(path.resolve(__dirname, 'routes'))
    .filter(file => /routes.js$/.test(file))
    .forEach(route => require(path.resolve(__dirname, 'routes', route))(app))
}
