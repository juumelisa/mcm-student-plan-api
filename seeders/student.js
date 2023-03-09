const Student = require("../models/student")

const students = async() => {
  const student = await Student.findAll();
  const seedStudent = {
    studentId: 12192008,
    fullName: 'Emma Watson',
    major: 'Matematika',
    email: 'emmawatson@email.com',
    password: 'Emma12192008'
  }
  if(student.length < 1){
    await Student.create(seedStudent);
  }
};

module.exports = students;