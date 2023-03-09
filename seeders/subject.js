const Subject = require("../models/subject")

const subjects = async() => {
  const subject = await Subject.findAll();
  const seedRole = [
    { code: 'MT001',  name: 'Kalkulus I' },
    { code: 'MT002', name: 'Kalkulus II' },
    { code: 'MT002', name: 'Aljabar Linear Elementer' },
  ];

  if (subject.length === 0) {
    await Subject.bulkCreate(seedRole);
  }
}

module.exports = subjects;