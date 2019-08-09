require('dotenv').config()
const app = require('kth-node-server')
const logger = require('./logger')
app.use('/api/lms-sync-courses/', require('./systemroutes'))
app.start({
  port: 3000,
  logger
})
