
import { useState } from "react";
import { X } from "lucide-react";
import { apiRequest } from "../services/patientApi";
import { OPTIONS, today, emptyPatient } from "../utils/patientOptions";

function PatientForm({ patient, onClose, onSaved }) {
  const editing = Boolean(patient);

  const [form, setForm] = useState(
    patient
      ? { ...patient, age: String(patient.age) }
      : emptyPatient()
  );

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  function update(field, value) {
    setForm(previous => ({
      ...previous,
      [field]: value
    }));
  }

  function validate() {
    const next = {};

    if (!form.name.trim()) {
      next.name = "Patient name is required.";
    } else if (!/^[A-Za-z ]+$/.test(form.name.trim())) {
      next.name = "Use letters and spaces only.";
    }

    if (
      form.age === "" ||
      !Number.isInteger(Number(form.age)) ||
      Number(form.age) < 0 ||
      Number(form.age) > 120
    ) {
      next.age = "Age must be between 0 and 120.";
    }

    if (!OPTIONS.genders.includes(form.gender)) {
      next.gender = "Please select a valid gender.";
    }

    if (!OPTIONS.wards.includes(form.ward)) {
      next.ward = "Please select a valid ward.";
    }

    if (!OPTIONS.departments.includes(form.department)) {
      next.department = "Please select a valid department.";
    }

    if (!OPTIONS.doctors.includes(form.doctor)) {
      next.doctor = "Please select a valid doctor.";
    }

    if (!form.admission_date) {
      next.admission_date = "Admission date is required.";
    } else if (form.admission_date > today()) {
      next.admission_date = "Date cannot be in the future.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(e) {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);
    setServerError("");

    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        age: Number(form.age)
      };

      await apiRequest(
        editing
          ? `/api/patients/${patient.id}`
          : "/api/patients",
        {
          method: editing ? "PUT" : "POST",
          body: JSON.stringify(payload)
        }
      );

      onSaved(
        editing
          ? "Patient updated successfully."
          : "Patient added successfully."
      );
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={e => {
        if (e.target === e.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div className="patient-modal">
        <div className="modal-header">
          <div>
            <span className="eyebrow">
              {editing ? "UPDATE PATIENT" : "NEW REGISTRATION"}
            </span>

            <h2>{editing ? "Edit Patient" : "Add Patient"}</h2>

            <p>Enter the patient's admission information.</p>
          </div>

          <button
            className="close-button"
            onClick={onClose}
            type="button"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="form-grid">
            <label>
              Patient Name *
              <input
                value={form.name}
                onChange={e => update("name", e.target.value)}
                placeholder="Enter full name"
              />
              {errors.name && <small className="form-error">{errors.name}</small>}
            </label>

            <label>
              Age *
              <input
                type="number"
                min="0"
                max="120"
                value={form.age}
                onChange={e => update("age", e.target.value)}
                placeholder="Enter age"
              />
              {errors.age && <small className="form-error">{errors.age}</small>}
            </label>

            <label>
              Gender *
              <select
                value={form.gender}
                onChange={e => update("gender", e.target.value)}
              >
                <option value="">Select gender</option>
                {OPTIONS.genders.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              {errors.gender && <small className="form-error">{errors.gender}</small>}
            </label>

            <label>
              Ward *
              <select
                value={form.ward}
                onChange={e => update("ward", e.target.value)}
              >
                <option value="">Select ward</option>
                {OPTIONS.wards.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              {errors.ward && <small className="form-error">{errors.ward}</small>}
            </label>

            <label>
              Department *
              <select
                value={form.department}
                onChange={e => update("department", e.target.value)}
              >
                <option value="">Select department</option>
                {OPTIONS.departments.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              {errors.department && <small className="form-error">{errors.department}</small>}
            </label>

            <label>
              Doctor *
              <select
                value={form.doctor}
                onChange={e => update("doctor", e.target.value)}
              >
                <option value="">Select doctor</option>
                {OPTIONS.doctors.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              {errors.doctor && <small className="form-error">{errors.doctor}</small>}
            </label>

            <label>
              Admission Date *
              <input
                type="date"
                max={today()}
                value={form.admission_date}
                onChange={e => update("admission_date", e.target.value)}
              />
              {errors.admission_date && (
                <small className="form-error">{errors.admission_date}</small>
              )}
            </label>

            <label>
              Status
              <select
                value={form.status}
                onChange={e => update("status", e.target.value)}
              >
                <option value="Admitted">Admitted</option>
                <option value="Discharged">Discharged</option>
              </select>
            </label>
          </div>

          {serverError && (
            <div className="form-server-error">{serverError}</div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editing
                  ? "Save Changes"
                  : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientForm;
