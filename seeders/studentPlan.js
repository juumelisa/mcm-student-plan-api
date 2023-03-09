const Subject = require("../models/subject")

const studentPlan = async() => {
  const subject = await Subject.findAll();
  const seedRole = [
    { studentId: 12192008,  subjectCode: 'MT001' },
    { studentId: 12192008,  subjectCode: 'MT003' },
  ];

  if (subject.length === 0) {
    await Subject.bulkCreate(seedRole);
  }
}

module.exports = studentPlan;