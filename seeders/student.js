const Student = require("../models/product")

const students = async() => {
  const studentList = await Student.findAll();

  const seedStudent = {
    student_id: 12192008,
    fullName: 'Emma Watson'
  }
  if(studentList.length < 1){
    await Student.create(seedStudent);
  }
};

module.exports = students;