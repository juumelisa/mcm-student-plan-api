const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');

const Student = sequelize.define('student', {
  student_id: {
    type: Sequelize.INTEGER,
    unique: true,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Student ID cannot be null!',
      },
      notEmpty: {
        msg: 'Student ID cannot be empty!',
      },
    }
  },
  fullName: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Student ID cannot be null!',
      },
      notEmpty: {
        msg: 'Student ID cannot be empty!',
      },
    }
  },
  major: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Major cannot be null!',
      },
      notEmpty: {
        msg: 'Major cannot be empty!',
      },
    }
  }
})

module.exports = Student;