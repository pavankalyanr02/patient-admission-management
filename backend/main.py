
import sqlite3
import re
from datetime import date
from pathlib import Path
from typing import Optional, Literal

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator


# --------------------------------
# 1. APPLICATION INITIALIZATION
# --------------------------------

app = FastAPI(
    title="Patient Admission Management API",
    description="API for managing hospital patient admissions",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# --------------------------------
# 2. DATABASE CONFIGURATION
# --------------------------------

DATABASE = Path(__file__).resolve().parent / "patients.db"


def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def create_table():

    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS patients (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL,
            ward TEXT NOT NULL,
            department TEXT NOT NULL,
            doctor TEXT NOT NULL,
            admission_date TEXT NOT NULL,

            status TEXT NOT NULL DEFAULT 'Admitted'

        )
    """)

    connection.commit()
    connection.close()


create_table()


# --------------------------------
# 3. ALLOWED DROPDOWN OPTIONS
# --------------------------------

GENDERS = ["Male", "Female", "Other"]

WARDS = [
    "General Ward",
    "ICU",
    "Emergency",
    "Maternity",
    "Paediatrics",
    "Surgery"
]

DEPARTMENTS = [
    "Cardiology",
    "Neurology",
    "Orthopaedics",
    "General Medicine",
    "Paediatrics",
    "Oncology"
]

DOCTORS = [
    "Dr. Ananya Rao",
    "Dr. Arjun Mehta",
    "Dr. Kavya Nair",
    "Dr. Rohan Shah",
    "Dr. Sneha Iyer"
]


# --------------------------------
# 4. PATIENT DATA MODEL
# --------------------------------

class Patient(BaseModel):

    name: str = Field(min_length=1, max_length=80)

    age: int = Field(ge=0, le=120)

    gender: str
    ward: str
    department: str
    doctor: str

    admission_date: date

    status: Literal["Admitted", "Discharged"] = "Admitted"


    @field_validator("name")
    @classmethod
    def validate_name(cls, value):

        if not re.fullmatch(r"[A-Za-z ]+", value.strip()):
            raise ValueError(
                "Name must contain letters and spaces only"
            )

        return value.strip()


    @field_validator("gender")
    @classmethod
    def validate_gender(cls, value):

        if value not in GENDERS:
            raise ValueError("Invalid gender selected")

        return value


    @field_validator("ward")
    @classmethod
    def validate_ward(cls, value):

        if value not in WARDS:
            raise ValueError("Invalid ward selected")

        return value


    @field_validator("department")
    @classmethod
    def validate_department(cls, value):

        if value not in DEPARTMENTS:
            raise ValueError("Invalid department selected")

        return value


    @field_validator("doctor")
    @classmethod
    def validate_doctor(cls, value):

        if value not in DOCTORS:
            raise ValueError("Invalid doctor selected")

        return value


    @field_validator("admission_date")
    @classmethod
    def validate_admission_date(cls, value):

        if value > date.today():
            raise ValueError(
                "Admission date cannot be in the future"
            )

        return value


# --------------------------------
# 5. HOME AND HEALTH ROUTES
# --------------------------------

@app.get("/")
def home():

    return {
        "message": "Patient Admission Management API is running"
    }


@app.get("/health")
def health():

    return {"status": "ok"}


# --------------------------------
# 6. GET DROPDOWN OPTIONS
# --------------------------------

@app.get("/api/options")
def get_options():

    return {
        "genders": GENDERS,
        "wards": WARDS,
        "departments": DEPARTMENTS,
        "doctors": DOCTORS
    }


# --------------------------------
# 7. ADD PATIENT
# --------------------------------

@app.post("/api/patients")
def add_patient(patient: Patient):

    connection = get_connection()

    cursor = connection.execute("""

        INSERT INTO patients
        (name, age, gender, ward, department,
         doctor, admission_date, status)

        VALUES (?, ?, ?, ?, ?, ?, ?, ?)

    """, (
        patient.name,
        patient.age,
        patient.gender,
        patient.ward,
        patient.department,
        patient.doctor,
        patient.admission_date.isoformat(),
        patient.status
    ))

    connection.commit()

    patient_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Patient added successfully",
        "patient_id": patient_id
    }


# --------------------------------
# 8. VIEW ALL PATIENTS
# --------------------------------

@app.get("/api/patients")
def get_patients(

    search: Optional[str] = None,
    ward: Optional[str] = None,
    department: Optional[str] = None,
    doctor: Optional[str] = None

):

    connection = get_connection()

    query = "SELECT * FROM patients WHERE 1=1"

    parameters = []

    if search:
        query += " AND LOWER(name) LIKE ?"
        parameters.append(f"%{search.lower()}%")

    if ward:
        query += " AND ward = ?"
        parameters.append(ward)

    if department:
        query += " AND department = ?"
        parameters.append(department)

    if doctor:
        query += " AND doctor = ?"
        parameters.append(doctor)

    query += " ORDER BY id DESC"

    rows = connection.execute(
        query, parameters
    ).fetchall()

    connection.close()

    return [dict(row) for row in rows]


# --------------------------------
# 9. EDIT PATIENT
# --------------------------------

@app.put("/api/patients/{patient_id}")
def update_patient(patient_id: int, patient: Patient):

    connection = get_connection()

    existing = connection.execute(
        "SELECT id FROM patients WHERE id = ?",
        (patient_id,)
    ).fetchone()

    if not existing:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    connection.execute("""

        UPDATE patients SET

        name = ?,
        age = ?,
        gender = ?,
        ward = ?,
        department = ?,
        doctor = ?,
        admission_date = ?,
        status = ?

        WHERE id = ?

    """, (
        patient.name,
        patient.age,
        patient.gender,
        patient.ward,
        patient.department,
        patient.doctor,
        patient.admission_date.isoformat(),
        patient.status,
        patient_id
    ))

    connection.commit()
    connection.close()

    return {"message": "Patient updated successfully"}


# --------------------------------
# 10. DISCHARGE PATIENT
# --------------------------------

@app.patch("/api/patients/{patient_id}/discharge")
def discharge_patient(patient_id: int):

    connection = get_connection()

    cursor = connection.execute("""

        UPDATE patients
        SET status = 'Discharged'
        WHERE id = ?

    """, (patient_id,))

    connection.commit()
    connection.close()

    if cursor.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return {"message": "Patient discharged successfully"}


# --------------------------------
# 11. DELETE PATIENT
# --------------------------------

@app.delete("/api/patients/{patient_id}")
def delete_patient(patient_id: int):

    connection = get_connection()

    cursor = connection.execute("""

        DELETE FROM patients
        WHERE id = ?

    """, (patient_id,))

    connection.commit()
    connection.close()

    if cursor.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return {"message": "Patient deleted successfully"}
