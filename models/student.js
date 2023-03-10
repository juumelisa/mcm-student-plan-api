const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');

const Student = sequelize.define('student', {
  studentId: {
    type: Sequelize.INTEGER,
    unique: true,
    allowNull: false,
    autoIncrement: true,
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
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Email cannot be null!',
      },
      notEmpty: {
        msg: 'Email cannot be empty!',
      },
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
    allowNull: false,
    defaultValue: 'ACTIVE'
  }
})

module.exports = Student;