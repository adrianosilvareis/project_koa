require('dotenv').config()

const app = require('./src/config/app')

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}

require('./src/config/database')('mongodb://localhost:27017/test', mongoOptions)

app.listen(3000, () => console.log('server listen on http://localhost:3000'))
