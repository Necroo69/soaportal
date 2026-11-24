/*
 * All the data shown on the portal lives here.
 * Edit this file to change what the pages display.
 */
window.PORTAL_DATA = {
  student: {
    name: "AYUSH RANJAN PANDA",
    enrollmentNo: "24E116E79",
    instituteCode: "ITER",
    academicYear: "2024",
    admissionYear: "2024",
    program: "BTECH",
    programFull: "Bachelor of Technology",
    branch: "Computer Science and Engineering",
    section: "24E1F1",
    subsection: "24E1F1",
    lateralEntry: "N",
    currentSemester: "5",
    photo: "assets/student-photo.jpg"
  },

  // Fill these in if you want the "Contact" / "Parents" tabs to show values.
  contact: {
    mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pin: ""
  },
  parents: {
    fatherName: "",
    motherName: "",
    guardianMobile: ""
  },

  semesterCodes: ["ITER ODD SEM 2026-27"],

  // attended / total; "percent" (optional) overrides the calculated percentage
  attendance: {
    "ITER ODD SEM 2026-27": [
      { sty: 5, code: "CSE3249", subject: "DESIGN PRINCIPLES OF OPERATING SYSTEMS", attended: 27, total: 35, percent: 77.93 },
      { sty: 5, code: "CSE3544", subject: "PRACTICAL PROGRAMMING WITH C", attended: 30, total: 36, percent: 83.4 },
      { sty: 5, code: "CSE3731", subject: "INTRODUCTION TO THE THEORY OF COMPUTATION", attended: 17, total: 24, percent: 71.34 },
      { sty: 5, code: "CSE3751", subject: "COMPUTER NETWORKING: CONCEPTS", attended: 24, total: 31, percent: 78.9 },
      { sty: 5, code: "CSE3967", subject: "MACHINE LEARNING CONCEPTS 1", attended: 15, total: 20, percent: 74.13 },
      { sty: 5, code: "GET2024", subject: "INTERMEDIATE PROBLEM SOLVING - 1", attended: 14, total: 25, percent: 56 },
      { sty: 5, code: "MTH3647", subject: "FUNDAMENTALS OF MACHINE INTELLIGENCE 1", attended: 22, total: 27, percent: 81 }
    ]
  },

  // Rows: { day: "MONDAY", period: "09:00-10:00", code: "CSE3249", subject: "...", room: "..." }
  timeTable: {
    "ITER ODD SEM 2026-27": []
  },

  results: [
    { semester: "1st SEM.", points: 125.5, courseCredits: 19, earnedCredits: 19, sgpa: "6.61", cgpa: "6.61" },
    { semester: "2nd SEM.", points: 132.5, courseCredits: 21, earnedCredits: 21, sgpa: "6.31", cgpa: "6.45" },
    { semester: "3rd SEM.", points: 148.5, courseCredits: 21, earnedCredits: 21, sgpa: "7.07", cgpa: "6.66" },
    { semester: "4th SEM.", points: 146.5, courseCredits: 21, earnedCredits: 21, sgpa: "6.98", cgpa: "6.74" }
  ],

  registrationCodes: ["ITER ODD SEM 2026-27"],
  examDescriptions: ["END SEMESTER EXAMINATION"]
};
