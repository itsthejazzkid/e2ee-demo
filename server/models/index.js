/* This file reads all model files in api/models/, and loads them,
 * plus a sequelize instance, plus the Sequelize class (which has 
 * all the data types attached to it)
 *
 * i.e. db.sequelize.define...
 *      db.Sequelize.STRING
 *      db.User.create/update/destroy
 */

'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV;
var dbConfig    = require(path.resolve(__dirname, '../../db/config'))[env];
var db        = {};

if (dbConfig.use_env_variable) {
  var sequelize = new Sequelize(process.env[dbConfig.use_env_variable]);
} else {
  var sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

