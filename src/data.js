const students = [
  { studentId: "663020001", name: "Somchai Test", status: "ACTIVE", totalCredits: 18 },
  { studentId: "663020002", name: "Somsri Test", status: "INACTIVE", totalCredits: 12 },
  { studentId: "663020003", name: "Mana Boundary", status: "ACTIVE", totalCredits: 19 },
  { studentId: "663020004", name: "Mali OverLimit", status: "ACTIVE", totalCredits: 20 }
];

const courses = [
  { courseId: "CP321001", courseName: "Software Testing", credits: 3, capacity: 30, enrolled: 10 },
  { courseId: "CP322001", courseName: "Web Application", credits: 4, capacity: 30, enrolled: 30 },
  { courseId: "CP323001", courseName: "API Development", credits: 4, capacity: 25, enrolled: 10 }
];

const registrations = [
  { registrationId: 1, studentId: "663020001", courseId: "CP323001" }
];

module.exports = { students, courses, registrations };
