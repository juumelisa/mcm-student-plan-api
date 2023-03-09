const Subject = require("../models/subject")

const studentPlan = async() => {
  const subject = await Subject.findAll();
  const seedRole = [
    { student_id: 12192008,  subject_code: 'MT001' },
    { student_id: 12192008,  subject_code: 'MT003' },
  ];

  if (subject.length === 0) {
    await Subject.bulkCreate(seedRole);
  }
}

module.exports = studentPlan;