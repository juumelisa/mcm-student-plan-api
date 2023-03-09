const {Sequelize} = require('sequelize');
require('dotenv').config();

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
console.log('db_HOST: ', process.env.DB_PASSWORD);
const mysql = require("mysql2");

// Open the connection to MySQL server
const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
});

// Run create database statement
connection.query(
  `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`,
  function (err, results) {
    console.log(results);
    console.log(err);
  }
);

// Close the connection
connection.end();

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql'
});

module.exports = sequelize;