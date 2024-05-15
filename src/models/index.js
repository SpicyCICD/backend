const dbConfig = require('../config/db.config')
const Sequelize = require('sequelize')

const db = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  logging: false
})

db.authenticate().then(() => {}
).catch((err) => {
  console.log(`Error Connecting to DB: ${err}`)
}
)

module.exports = db
