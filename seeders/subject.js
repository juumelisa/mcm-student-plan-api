const Subject = require("../models/subject")

const subjects = async() => {
  const subject = await Subject.findAll();
  const seedRole = [
    { code: 'MT001',  name: 'Kalkulus I', subjectLevel: 'University' },
    { code: 'MT002', name: 'Kalkulus II', subjectLevel: 'Faculty' },
    { code: 'MT003', name: 'Aljabar Linear Elementer', subjectLevel: 'Department' },
  ];

  if (subject.length === 0) {
    await Subject.bulkCreate(seedRole);
  }
}

module.exports = subjects;