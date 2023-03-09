const Sequelize = require('sequelize');
const sequelize = require('../helpers/sequelize');
const Student = require('./student');
const Subject = require('./subject');

const StudentPlan = sequelize.define('studyPlan', {
  student_id: {
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
  subject_code: {
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
  }
})

StudentPlan.belongsTo(Student, {
  foreignKey: 'student_id',
  allowNull: false
})

StudentPlan.belongsTo(Subject, {
  foreignKey: 'subject_code',
  allowNull: false
})

module.exports = StudentPlan;