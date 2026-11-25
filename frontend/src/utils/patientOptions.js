
// Available gender options
export const OPTIONS = {

  genders: [
    "Male",
    "Female",
    "Other"
  ],

  // Available hospital wards
  wards: [
    "General Ward",
    "ICU",
    "Emergency",
    "Maternity",
    "Paediatrics",
    "Surgery"
  ],

  // Available medical departments
  departments: [
    "Cardiology",
    "Neurology",
    "Orthopaedics",
    "General Medicine",
    "Paediatrics",
    "Oncology"
  ],

  // Available doctors
  doctors: [
    "Dr. Ananya Rao",
    "Dr. Arjun Mehta",
    "Dr. Kavya Nair",
    "Dr. Rohan Shah",
    "Dr. Sneha Iyer"
  ]

};


// Get today's date in YYYY-MM-DD format
export function today() {

  const d = new Date();

  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0")
  ].join("-");

}


// Initial values for a new patient
export function emptyPatient() {

  return {

    name: "",
    age: "",
    gender: "",
    ward: "",
    department: "",
    doctor: "",
    admission_date: today(),
    status: "Admitted"

  };

}
