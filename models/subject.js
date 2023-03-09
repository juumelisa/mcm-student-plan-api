const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');

const Subject = sequelize.define('subject', {
  code: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    primaryKey: true,
    validate: {
      notNull: {
        msg: 'Student ID cannot be null!',
      },
      notEmpty: {
        msg: 'Student ID cannot be empty!',
      },
    },
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Name cannot be null!',
      },
      notEmpty: {
        msg: 'Name cannot be empty!',
      },
    },
  },
  subjectLevel: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'subjectLevel cannot be null!',
      },
      notEmpty: {
        msg: 'subjectLevel cannot be empty!',
      },
    },
  },
  department: {
    type: Sequelize.STRING,
    allowNull: true
  },
  faculty: {
    type: Sequelize.STRING,
    allowNull: true
  }
})

module.exports = Subject;