
import os
import re
from datetime import date
from pathlib import Path
from typing import Optional, Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from sqlalchemy import (
    create_engine,
    MetaData,
    Table,
    Column,
    Integer,
    String,
    Date,
    select,
    insert,
    update,
    delete,
    text
)


# --------------------------------
# 1. APPLICATION INITIALIZATION
# --------------------------------

app = FastAPI(
    title="Patient Admission Management API",
    description="API for managing hospital patient admissions",
    version="1.0.0"
)

frontend_url = os.getenv("FRONTEND_URL", "")

allowed_origins = ["http://localhost:5173"]

if frontend_url:
    allowed_origins.append(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# --------------------------------
# 2. DATABASE CONFIGURATION
# --------------------------------

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Render PostgreSQL connection
    # Convert Render's URL to the psycopg 3 SQLAlchemy driver.
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace(
            "postgres://",
            "postgresql+psycopg://",
            1
        )
    elif DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace(
            "postgresql://",
            "postgresql+psycopg://",
            1
        )

    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True
    )

else:
    # Local SQLite database for development
    DATABASE = Path(__file__).resolve().parent / "patients.db"

    engine = create_engine(
        f"sqlite:///{DATABASE}",
        connect_args={"check_same_thread": False}
    )


metadata = MetaData()

patients = Table(
    "patients",
    metadata,

    Column("id", Integer, primary_key=True, autoincrement=True),

    Column("name", String(80), nullable=False),
    Column("age", Integer, nullable=False),
    Column("gender", String(20), nullable=False),
    Column("ward", String(50), nullable=False),
    Column("department", String(80), nullable=False),
    Column("doctor", String(100), nullable=False),
    Column("admission_date", Date, nullable=False),
    Column("status", String(20), nullable=False, default="Admitted")
)


def create_table():
    metadata.create_all(engine)


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
# 5. HELPER FUNCTION
# --------------------------------

def serialize_patient(row):

    patient = dict(row)

    if isinstance(patient.get("admission_date"), date):
        patient["admission_date"] = (
            patient["admission_date"].isoformat()
        )

    return patient


# --------------------------------
# 6. HOME AND HEALTH ROUTES
# --------------------------------

@app.get("/")
def home():

    return {
        "message": "Patient Admission Management API is running"
    }


@app.get("/health")
def health():

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "ok",
            "database": "connected"
        }

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Database connection failed"
        )


# --------------------------------
# 7. GET DROPDOWN OPTIONS
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
# 8. ADD PATIENT
# --------------------------------

@app.post("/api/patients")
def add_patient(patient: Patient):

    patient_data = patient.model_dump()

    with engine.begin() as connection:

        result = connection.execute(
            insert(patients).values(**patient_data)
        )

        patient_id = result.inserted_primary_key[0]

    return {
        "message": "Patient added successfully",
        "patient_id": patient_id
    }


# --------------------------------
# 9. VIEW ALL PATIENTS
# --------------------------------

@app.get("/api/patients")
def get_patients(
    search: Optional[str] = None,
    ward: Optional[str] = None,
    department: Optional[str] = None,
    doctor: Optional[str] = None
):

    query = select(patients)

    if search:
        query = query.where(
            patients.c.name.ilike(f"%{search}%")
        )

    if ward:
        query = query.where(patients.c.ward == ward)

    if department:
        query = query.where(
            patients.c.department == department
        )

    if doctor:
        query = query.where(patients.c.doctor == doctor)

    query = query.order_by(patients.c.id.desc())

    with engine.connect() as connection:
        rows = connection.execute(query).mappings().all()

    return [serialize_patient(row) for row in rows]


# --------------------------------
# 10. EDIT PATIENT
# --------------------------------

@app.put("/api/patients/{patient_id}")
def update_patient(patient_id: int, patient: Patient):

    with engine.begin() as connection:

        existing = connection.execute(
            select(patients.c.id).where(
                patients.c.id == patient_id
            )
        ).first()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Patient not found"
            )

        connection.execute(
            update(patients)
            .where(patients.c.id == patient_id)
            .values(**patient.model_dump())
        )

    return {
        "message": "Patient updated successfully"
    }


# --------------------------------
# 11. DISCHARGE PATIENT
# --------------------------------

@app.patch("/api/patients/{patient_id}/discharge")
def discharge_patient(patient_id: int):

    with engine.begin() as connection:

        result = connection.execute(
            update(patients)
            .where(patients.c.id == patient_id)
            .values(status="Discharged")
        )

        if result.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Patient not found"
            )

    return {
        "message": "Patient discharged successfully"
    }


# --------------------------------
# 12. DELETE PATIENT
# --------------------------------

@app.delete("/api/patients/{patient_id}")
def delete_patient(patient_id: int):

    with engine.begin() as connection:

        result = connection.execute(
            delete(patients).where(
                patients.c.id == patient_id
            )
        )

        if result.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Patient not found"
            )

    return {
        "message": "Patient deleted successfully"
    }
