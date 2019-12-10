module.exports = app => {
  app.on('error', (err, ctx) => {
    ctx.body = err
    err.expose = true
  })
}
