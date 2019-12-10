const mongoose = require('mongoose')

module.exports = (uri, options) => {
  mongoose.connect(uri, options)
  mongoose.Promise = global.Promise

  mongoose.connection.on('connected', () =>
    console.log(`Mongoose! Conectado em ${uri}`)
  )
  mongoose.connection.on('disconnected', () =>
    console.log(`Mongoose! desconectado de ${uri}`)
  )
  mongoose.connection.on('error', error => console.log(`Mongoose! ${error}`))

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose! desconectado pelo terminal da aplicação')
      process.exit(0)
    })
  })

  return mongoose
}
