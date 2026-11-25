
import { useEffect, useState } from "react";
import { Plus, CheckCircle, X } from "lucide-react";

import "./App.css";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatsCards from "./components/StatsCards";
import PatientForm from "./components/PatientForm";
import PatientDirectory from "./components/PatientDirectory";

import { apiRequest } from "./services/patientApi";


function App() {

  // =====================================
  // 1. APPLICATION STATE
  // =====================================

  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [ward, setWard] = useState("");

  const [department, setDepartment] = useState("");

  const [doctor, setDoctor] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingPatient, setEditingPatient] = useState(null);

  const [toast, setToast] = useState("");

  const [activeNav, setActiveNav] = useState("dashboard");

  const [profileOpen, setProfileOpen] = useState(false);


  // =====================================
  // 2. FETCH PATIENTS FROM BACKEND
  // =====================================

  async function fetchPatients() {

    setLoading(true);
    setError("");

    try {

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (ward) {
        params.set("ward", ward);
      }

      if (department) {
        params.set("department", department);
      }

      if (doctor) {
        params.set("doctor", doctor);
      }

      const data = await apiRequest(
        `/api/patients?${params.toString()}`
      );

      setPatients(data);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }

  }


  // =====================================
  // 3. FETCH WHEN FILTERS CHANGE
  // =====================================

  useEffect(() => {

    const timer = setTimeout(() => {
      fetchPatients();
    }, 300);

    return () => clearTimeout(timer);

  }, [search, ward, department, doctor]);


  // =====================================
  // 4. SUCCESS MESSAGE
  // =====================================

  useEffect(() => {

    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => clearTimeout(timer);

  }, [toast]);


  // =====================================
  // 5. SIDEBAR NAVIGATION
  // =====================================

  function goToDashboard() {

    setActiveNav("dashboard");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  function goToPatients() {

    setActiveNav("patients");

    setProfileOpen(false);

    document
      .getElementById("patient-directory")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

  }


  // =====================================
  // 6. ADD PATIENT
  // =====================================

  function openAddForm() {

    setEditingPatient(null);

    setShowForm(true);

  }


  // =====================================
  // 7. EDIT PATIENT
  // =====================================

  function openEditForm(patient) {

    setEditingPatient(patient);

    setShowForm(true);

  }


  // =====================================
  // 8. SAVE PATIENT
  // =====================================

  async function handleSaved(message) {

    setShowForm(false);

    setEditingPatient(null);

    setToast(message);

    await fetchPatients();

  }


  // =====================================
  // 9. DISCHARGE PATIENT
  // =====================================

  async function dischargePatient(patient) {

    if (patient.status === "Discharged") return;

    const confirmed = window.confirm(
      `Mark ${patient.name} as discharged?`
    );

    if (!confirmed) return;

    try {

      await apiRequest(
        `/api/patients/${patient.id}/discharge`,
        {
          method: "PATCH"
        }
      );

      setToast("Patient discharged successfully.");

      await fetchPatients();

    } catch (err) {

      setToast(err.message);

    }

  }


  // =====================================
  // 10. DELETE PATIENT
  // =====================================

  async function deletePatient(patient) {

    const confirmed = window.confirm(
      `Are you sure you want to delete ${patient.name}'s record?`
    );

    if (!confirmed) return;

    try {

      await apiRequest(
        `/api/patients/${patient.id}`,
        {
          method: "DELETE"
        }
      );

      setToast("Patient deleted successfully.");

      await fetchPatients();

    } catch (err) {

      setToast(err.message);

    }

  }


  // =====================================
  // 11. CLEAR SEARCH AND FILTERS
  // =====================================

  function clearFilters() {

    setSearch("");

    setWard("");

    setDepartment("");

    setDoctor("");

  }


  // =====================================
  // 12. DASHBOARD STATISTICS
  // =====================================

  const totalPatients = patients.length;

  const admittedPatients = patients.filter(
    patient => patient.status === "Admitted"
  ).length;

  const dischargedPatients = patients.filter(
    patient => patient.status === "Discharged"
  ).length;

  const activeWards = new Set(

    patients
      .filter(patient => patient.status === "Admitted")
      .map(patient => patient.ward)

  ).size;


  // =====================================
  // 13. MAIN USER INTERFACE
  // =====================================

  return (

    <div className="app-container">


      {/* SIDEBAR */}
      <Sidebar
        activeNav={activeNav}
        onDashboard={goToDashboard}
        onPatients={goToPatients}
      />


      {/* MAIN CONTENT */}
      <main className="main-content">


        {/* TOP NAVIGATION */}
        <Topbar
          profileOpen={profileOpen}
          onToggleProfile={() =>
            setProfileOpen(previous => !previous)
          }
          onCloseProfile={() => setProfileOpen(false)}
        />


        {/* DASHBOARD */}
        <section className="dashboard">


          {/* PAGE HEADING */}
          <div className="page-heading">

            <div>

              <span className="eyebrow">
                HOSPITAL OVERVIEW
              </span>

              <h1>Patient Admissions</h1>

              <p>
                Monitor patients and manage hospital admissions.
              </p>

            </div>


            <button
              className="primary-button"
              onClick={openAddForm}
            >

              <Plus size={18} />

              Add Patient

            </button>

          </div>


          {/* DASHBOARD STATISTICS */}
          <StatsCards
            totalPatients={totalPatients}
            admittedPatients={admittedPatients}
            dischargedPatients={dischargedPatients}
            activeWards={activeWards}
          />


          {/* PATIENT DIRECTORY */}
          <PatientDirectory
            patients={patients}
            loading={loading}
            error={error}

            search={search}
            setSearch={setSearch}

            ward={ward}
            setWard={setWard}

            department={department}
            setDepartment={setDepartment}

            doctor={doctor}
            setDoctor={setDoctor}

            clearFilters={clearFilters}
            fetchPatients={fetchPatients}

            openEditForm={openEditForm}
            dischargePatient={dischargePatient}
            deletePatient={deletePatient}
          />


        </section>

      </main>


      {/* ADD / EDIT PATIENT FORM */}
      {showForm && (

        <PatientForm
          patient={editingPatient}
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />

      )}


      {/* TOAST NOTIFICATION */}
      {toast && (

        <div className="toast-message">

          <CheckCircle size={17} />

          {toast}

          <button onClick={() => setToast("")}>
            <X size={15} />
          </button>

        </div>

      )}


    </div>

  );

}


export default App;
