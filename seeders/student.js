const Student = require("../models/student")

const students = async() => {
  const student = await Student.findAll();
  const seedStudent = {
    student_id: 12192008,
    full_name: 'Emma Watson',
    major: 'Matematika',
    email: 'emmawatson@email.com',
    password: 'Emma12192008'
  }
  if(student.length < 1){
    await Student.create(seedStudent);
  }
};

module.exports = students;