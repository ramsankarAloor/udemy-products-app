const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '5454', {dialect : 'mysql', host : 'localhost'}); 
//this will create a connextion between sequelize and mysql database.. like the connection pool we did last time.

module.exports = sequelize;