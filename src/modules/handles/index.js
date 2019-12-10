const fs = require('fs')
const path = require('path')

module.exports = app => {
  fs.readdirSync(path.resolve(__dirname))
    .filter(file => /.handle.js$/.test(file))
    .forEach(route => require(path.resolve(__dirname, route))(app))
}
