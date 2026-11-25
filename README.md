# Patient Admission Management System

A full-stack web application designed to help hospital staff manage patient admissions efficiently. The system allows staff to register patients, view admission records, search and filter patients, update patient details, and manage discharge status.

## Live Application

- **Frontend:** https://patient-admission-management-cscvv59dx.vercel.app
- **Backend API:** https://patient-admission-backend-45ne.onrender.com
- **GitHub Repository:** https://github.com/pavankalyanr02/patient-admission-management

## Technology Stack

### Frontend
- React.js
- JavaScript
- CSS
- Vite
- Lucide React

### Backend
- Python
- FastAPI
- Pydantic
- SQLAlchemy

### Database
- PostgreSQL (Production)
- SQLite (Local Development)

### Deployment
- Vercel – Frontend hosting
- Render – Backend hosting and PostgreSQL database

## Features

- Add new patient records.
- View all registered patients.
- Search patients by name.
- Filter patients by ward, department, and doctor.
- Edit existing patient information.
- Delete patient records with confirmation.
- Mark patients as discharged.
- Dashboard with patient statistics.
- Responsive user interface for different screen sizes.
- Backend and frontend validation.
- Persistent database storage.

## Patient Information

Each patient record contains:

| Field | Description |
|---|---|
| Name | Patient's full name |
| Age | Patient's age (0–120) |
| Gender | Male, Female, or Other |
| Ward | Selected hospital ward |
| Department | Medical department |
| Doctor | Assigned doctor |
| Admission Date | Date of admission |
| Status | Admitted or Discharged |

## Validation

The application implements validation on both frontend and backend:

- Patient name is required and accepts letters and spaces only.
- Age must be between 0 and 120.
- Gender, ward, department, and doctor must be selected from the available options.
- Admission date is required and cannot be a future date.
- Invalid requests are rejected by the backend with appropriate error messages.

## Project Structure

```text
patient-admission-management/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── patients.db
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── index.html
│
├── .gitignore
└── README.md
```

## Run Locally

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/pavankalyanr02/patient-admission-management.git
cd patient-admission-management
```

### 2. Start the backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

Backend URL:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

### 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

Frontend URL:

`http://localhost:5173`

## Production Environment Variables

Configure these variables in the respective hosting platforms.

### Render – Backend

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection URL |
| `FRONTEND_URL` | Deployed Vercel frontend URL |

### Vercel – Frontend

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Deployed Render backend URL |

Do not commit database credentials or other secrets to GitHub.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/health` | Health and database check |
| GET | `/api/options` | Retrieve dropdown options |
| POST | `/api/patients` | Add a patient |
| GET | `/api/patients` | Retrieve and filter patients |
| PUT | `/api/patients/{patient_id}` | Update patient details |
| PATCH | `/api/patients/{patient_id}/discharge` | Discharge a patient |
| DELETE | `/api/patients/{patient_id}` | Delete a patient |

## Screenshots

Add screenshots of the following application features:

1. Dashboard and patient statistics.
2. Patient directory.
3. Add patient form.
4. Edit patient form.
5. Search and filter functionality.

## Deployment

The application is deployed using:

- **Vercel:** React frontend.
- **Render:** FastAPI backend.
- **Render PostgreSQL:** Production database.

The frontend communicates with the backend through REST API endpoints.

## Author

**Pavan Kalyan R**

GitHub: https://github.com/pavankalyanr02

---

Developed as part of the Software Engineer Intern – Round 1 task.