const Student = require("../models/student")

const students = async() => {
  const student = await Student.findAll();
  console.log('studentList', student);
  const seedStudent = {
    student_id: 12192008,
    fullName: 'Emma Watson',
    major: 'Matematika'
  }
  if(student.length < 1){
    await Student.create(seedStudent);
  }
};

module.exports = students;