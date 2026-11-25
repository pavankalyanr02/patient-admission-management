
import {
  ClipboardList,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  RefreshCw
} from "lucide-react";

import { OPTIONS } from "../utils/patientOptions";


function PatientDirectory({
  patients,
  loading,
  error,
  search,
  setSearch,
  ward,
  setWard,
  department,
  setDepartment,
  doctor,
  setDoctor,
  clearFilters,
  fetchPatients,
  openEditForm,
  dischargePatient,
  deletePatient
}) {

  return (

    <section
      className="patient-section"
      id="patient-directory"
    >

      {/* DIRECTORY HEADING */}
      <div className="section-heading">

        <div>
          <h2>Patient Directory</h2>

          <p>
            Search and manage all patient records.
          </p>
        </div>

        <span className="record-count">
          {patients.length} Records
        </span>

      </div>


      {/* SEARCH AND FILTERS */}
      <div className="toolbar">

        {/* SEARCH */}
        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search patient name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

        </div>


        {/* FILTERS */}
        <div className="filter-group">

          <Filter size={17} />

          <select
            value={ward}
            onChange={e => setWard(e.target.value)}
          >
            <option value="">All Wards</option>

            {OPTIONS.wards.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}

          </select>


          <select
            value={department}
            onChange={e => setDepartment(e.target.value)}
          >
            <option value="">All Departments</option>

            {OPTIONS.departments.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}

          </select>


          <select
            value={doctor}
            onChange={e => setDoctor(e.target.value)}
          >
            <option value="">All Doctors</option>

            {OPTIONS.doctors.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}

          </select>


          {(search || ward || department || doctor) && (

            <button
              className="clear-button"
              onClick={clearFilters}
            >
              Clear
            </button>

          )}

        </div>

      </div>


      {/* PATIENT TABLE */}
      <div className="table-container">

        {error && (

          <div className="form-server-error">

            {error}

            <button onClick={fetchPatients}>
              <RefreshCw size={14} />
              Retry
            </button>

          </div>

        )}


        <table>

          <thead>
            <tr>
              <th>PATIENT</th>
              <th>WARD / DEPARTMENT</th>
              <th>DOCTOR</th>
              <th>ADMISSION DATE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>


          <tbody>

            {loading ? (

              <tr>
                <td colSpan="6" className="empty-state">
                  Loading patients...
                </td>
              </tr>

            ) : patients.length === 0 ? (

              <tr>
                <td colSpan="6" className="empty-state">
                  <ClipboardList size={30} />
                  <p>No patient records found.</p>
                </td>
              </tr>

            ) : (

              patients.map(patient => (

                <tr key={patient.id}>

                  {/* PATIENT DETAILS */}
                  <td>
                    <strong>{patient.name}</strong>

                    <small>
                      {patient.age} years · {patient.gender}
                    </small>
                  </td>


                  {/* WARD AND DEPARTMENT */}
                  <td>
                    <strong>{patient.ward}</strong>
                    <small>{patient.department}</small>
                  </td>


                  {/* DOCTOR */}
                  <td>
                    {patient.doctor}
                  </td>


                  {/* ADMISSION DATE */}
                  <td>
                    {patient.admission_date}
                  </td>


                  {/* STATUS */}
                  <td>
                    <span
                      className={
                        patient.status === "Admitted"
                          ? "status admitted"
                          : "status discharged"
                      }
                    >
                      {patient.status}
                    </span>
                  </td>


                  {/* ACTION BUTTONS */}
                  <td>

                    <div className="action-buttons">

                      {/* EDIT */}
                      <button
                        title="Edit patient"
                        onClick={() => openEditForm(patient)}
                      >
                        <Edit2 size={15} />
                      </button>


                      {/* DISCHARGE */}
                      {patient.status === "Admitted" && (

                        <button
                          title="Mark discharged"
                          onClick={() => dischargePatient(patient)}
                        >
                          <CheckCircle size={15} />
                        </button>

                      )}


                      {/* DELETE */}
                      <button
                        className="delete-button"
                        title="Delete patient"
                        onClick={() => deletePatient(patient)}
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>


      {/* DIRECTORY FOOTER */}
      <div className="directory-footer">
        Showing {patients.length} patient records
      </div>

    </section>

  );

}

export default PatientDirectory;
