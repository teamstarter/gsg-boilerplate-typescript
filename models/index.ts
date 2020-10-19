import configWithEnv from '../config/config'
import { Sequelize } from 'sequelize'
import fs from 'fs'
import path from 'path'
var basename = path.basename(__filename)
var env = process.env.NODE_ENV || 'development'

//@ts-ignore
const config: any = configWithEnv[env]
var db: any = {}
let sequelize: any = null

if (config.use_env_variable) {
  //@ts-ignore
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  )
}

fs.readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts'
    )
  })
  .forEach((file: string) => {
    var model = require(path.join(__dirname, file)).default(
      sequelize,
      sequelize.DataTypes
    )
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
