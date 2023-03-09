const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');
const Student = require('./student');
const Subject = require('./subject');

const StudentPlan = sequelize.define('studyPlan', {
  studentId: {
    type: Sequelize.INTEGER,
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
  subjectCode: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Student Code cannot be null!',
      },
      notEmpty: {
        msg: 'Student Code cannot be empty!',
      },
    }
  },
  grade: {
    type: Sequelize.CHAR,
    allowNull: false,
    defaultValue: 'F'
  }
})

StudentPlan.belongsTo(Student, {
  foreignKey: 'studentId',
  allowNull: false
})

StudentPlan.belongsTo(Subject, {
  foreignKey: 'subjectCode',
  allowNull: false
})

module.exports = StudentPlan;