const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');

const Subject = sequelize.define('subject', {
  code: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
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
        msg: 'Student ID cannot be null!',
      },
      notEmpty: {
        msg: 'Student ID cannot be empty!',
      },
    },
  }
})

module.exports = Subject;