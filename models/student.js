const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');

const Student = sequelize.define('student', {
  student_id: {
    type: Sequelize.INTEGER,
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
    }
  },
  full_name: {
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
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Student;