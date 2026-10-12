# 🎓 Apex College Management System (CMS)

A robust full-stack **College Management System** web application designed for modern academic administration. Built with **React + Vite** on the frontend, **Java Spring Boot** on the backend, and **MongoDB** as the database.

---

## 📌 Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19, Vite, JavaScript | Fast, component-driven UI with Lucide modern icons & Axios HTTP client |
| **Styling** | Vanilla CSS Design System | Curated Blue & White theme, responsive, card layouts, CSS tokens |
| **Backend** | Java 17, Spring Boot 3.2.5, Maven | Layered architecture: controller, service, repository, model, dto |
| **Database** | MongoDB 5.0+ | Persistent collections: `admins`, `students`, `faculty`, `courses`, `attendance`, `marks` |
| **API** | RESTful JSON APIs | CORS configured for Vite (`http://localhost:*`, `http://127.0.0.1:*`) |
| **Security** | BCrypt Authentication | Secure hashed credentials with session token persistence |

---

## 🏛️ Main Modules & Features

1. **Admin Authentication & Protected Routes**:
   - Secure login form with one-click **Auto Fill** for demo credentials (`admin` / `admin123`).
   - Session storage preservation with instant logout.
   - Protected routes in React preventing unauthenticated access to system views.
2. **Executive Real-Time Dashboard**:
   - 4 KPI summary cards: Total Students, Total Faculty, Total Courses, Institutional Attendance %.
   - Interactive Department Distribution progress indicators.
   - Today's Attendance breakdown (Present, Absent, Compliance threshold).
   - "Refresh Data" button dynamically syncing real database state.
   - Administrative Quick Actions shortcuts.
   - Recent Student Admissions table with direct profile links.
3. **Student Management**:
   - Real-time search by name, student roll ID, or email.
   - Filter by Department and Academic Year.
   - Add new student and Edit existing student modals with form validation and server conflict detection (duplicate ID prevention).
   - Delete student with custom confirmation dialog.
4. **Faculty Management**:
   - Faculty roster with Employee ID, Designation, Qualifications, and Contact info.
   - Departmental filtering and real-time search.
   - Add & Edit faculty modal forms.
5. **Course & Department Management**:
   - Course catalog cards detailing Course Code, Name, Credits, Target Semester, Assigned Instructor, and Description.
   - Filter by department tabs.
   - Add & Edit course modals with validation.
6. **Attendance Management**:
   - Daily attendance register by date picker and course selector.
   - Class roster with quick status toggle buttons: **Present**, **Absent**, **Late**.
   - Foreign-key integrity: strictly ensures student exists in database before recording attendance.
   - "Mark All Present" convenience button.
   - Real-time attendance rate calculation and batch database save.
7. **Marks Management & Gradebook**:
   - Filter by Subject Course and Assessment type (Midterm Exam, Final Exam, Assignment 1, Quiz 1).
   - Foreign-key integrity: strictly verifies student existence before saving examination grades.
   - Enter marks out of 100 with auto-calculated letter grades (`A+`, `A`, `B+`, `B`, `C`, `D`, `F`).
   - Instructor feedback notes and batch save.
8. **Student Details Page**:
   - Dedicated comprehensive dossier showing Student ID, Name, Email, Phone, Department, Course, Year, Semester, Date of Birth, Gender, and Address.
   - Direct deep-link URL support (`/student/:id` and `/students/by-student-id/:studentId`).
   - Student's individual **Attendance History** table with dates, courses, and overall attendance rate %.
   - Student's **Academic Grade Transcript** with marks obtained, percentage, and final grade.
   - Browser print action for paper transcripts.

---

## 🗂️ Project Structure

```
College_managment_system/
├── .data/
│   └── db/                                  # Embedded MongoDB data directory
├── .env.example                             # Root environment variable template
├── run-all.bat                              # One-click full-stack launcher
├── run-backend.bat                          # Spring Boot launcher
├── run-frontend.bat                         # React + Vite launcher
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/college/cms/
│       │   ├── CollegeManagementApplication.java
│       │   ├── config/
│       │   │   ├── CorsConfig.java          # Configured for localhost frontend
│       │   │   └── DataSeeder.java          # Seeds demo data on first startup
│       │   ├── controller/
│       │   │   ├── AuthController.java      # /api/auth
│       │   │   ├── DashboardController.java # /api/dashboard
│       │   │   ├── StudentController.java   # /api/students
│       │   │   ├── FacultyController.java   # /api/faculty
│       │   │   ├── CourseController.java    # /api/courses
│       │   │   ├── AttendanceController.java# /api/attendance
│       │   │   └── MarkController.java      # /api/marks
│       │   ├── dto/
│       │   ├── exception/
│       │   │   ├── GlobalExceptionHandler.java # Uniform JSON validation & error responses
│       │   │   └── ResourceNotFoundException.java
│       │   ├── model/
│       │   │   ├── Admin.java
│       │   │   ├── Student.java
│       │   │   ├── Faculty.java
│       │   │   ├── Course.java
│       │   │   ├── Attendance.java
│       │   │   └── Mark.java
│       │   ├── repository/
│       │   └── service/
│       └── resources/
│           └── application.properties       # MongoDB URI & server settings
├── frontend/
│   ├── .env                                 # Active frontend environment config
│   ├── .env.example                         # Frontend environment template
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx                          # Router & Protected route setup
│       ├── index.css                        # Modern Blue & White design system
│       ├── context/AuthContext.jsx          # Admin auth & session state
│       ├── services/api.js                  # Axios client with interceptors
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── SummaryCard.jsx
│       │   ├── Modal.jsx
│       │   ├── ConfirmDialog.jsx
│       │   └── Toast.jsx
│       └── views/
│           ├── LoginView.jsx
│           ├── DashboardView.jsx
│           ├── StudentsView.jsx
│           ├── FacultyView.jsx
│           ├── CoursesView.jsx
│           ├── AttendanceView.jsx
│           ├── MarksView.jsx
│           └── StudentDetailView.jsx
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Java 17** or higher
- **Maven 3.9+**
- **Node.js 18+** & npm
- **MongoDB 5.0+** running on `localhost:27017`

### 2. Environment Variables Configuration

Copy `.env.example` into `.env` (or configure application properties):

#### Frontend (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

#### Backend Environment Variables (optional, defaults provided):
```env
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=college_db
SERVER_PORT=8080
```

### 3. Quick Start (Windows)
To start MongoDB, Spring Boot Backend, and React Frontend in a single command:
```powershell
.\run-all.bat
```

### 4. Manual Startup Commands

#### Step 4.1: Start MongoDB
```powershell
# Using the bundled MongoDB instance:
.\.tools\mongodb-win32-x86_64-windows-5.0.28\bin\mongod.exe --dbpath .\.data\db --port 27017

# Or using system-installed MongoDB:
mongod --dbpath ./.data/db --port 27017
```

#### Step 4.2: Start Spring Boot Backend
Navigate to `backend` and run:
```powershell
cd backend
mvn spring-boot:run
```
*Backend runs at `http://localhost:8080`. On first run, it seeds default admin and initial sample records.*

#### Step 4.3: Start React Frontend
In a separate terminal:
```powershell
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 🔑 Default Administrator Credentials

- **Username**: `admin`
- **Password**: `admin123`
*(Or click the **Auto Fill** button directly on the login screen!)*

---

## 🌐 Complete REST API Endpoints Specification

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate admin | `{"username": "...", "password": "..."}` |
| `POST` | `/api/auth/register` | Register new admin | `{"username": "...", "password": "...", ...}` |

### Dashboard Statistics (`/api/dashboard`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Fetches real-time counts, attendance rate, dept distribution, recent students |

### Students (`/api/students`)
| Method | Endpoint | Description | Query / Path Params |
|---|---|---|---|
| `GET` | `/api/students` | Get list of students | `?search=...&department=...&year=...` |
| `GET` | `/api/students/{id}` | Get student by MongoDB ID | `{id}` |
| `GET` | `/api/students/by-student-id/{studentId}` | Get student by Roll ID | `{studentId}` (e.g. `STU-2024-001`) |
| `POST` | `/api/students` | Create student | Full Student JSON payload |
| `PUT` | `/api/students/{id}` | Update student details | `{id}`, updated Student JSON |
| `DELETE` | `/api/students/{id}` | Delete student | `{id}` |

### Faculty (`/api/faculty`)
| Method | Endpoint | Description | Query / Path Params |
|---|---|---|---|
| `GET` | `/api/faculty` | Get faculty list | `?search=...&department=...` |
| `GET` | `/api/faculty/{id}` | Get faculty by ID | `{id}` |
| `POST` | `/api/faculty` | Create faculty member | Full Faculty JSON payload |
| `PUT` | `/api/faculty/{id}` | Update faculty member | `{id}`, updated Faculty JSON |
| `DELETE` | `/api/faculty/{id}` | Delete faculty member | `{id}` |

### Courses (`/api/courses`)
| Method | Endpoint | Description | Query / Path Params |
|---|---|---|---|
| `GET` | `/api/courses` | Get course catalog | `?department=...` |
| `GET` | `/api/courses/{id}` | Get course by ID | `{id}` |
| `POST` | `/api/courses` | Create new course | Full Course JSON payload |
| `PUT` | `/api/courses/{id}` | Update course | `{id}`, updated Course JSON |
| `DELETE` | `/api/courses/{id}` | Delete course | `{id}` |

### Attendance (`/api/attendance`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/attendance?date=YYYY-MM-DD&courseCode=...` | Query attendance by date & course |
| `GET` | `/api/attendance/student/{studentId}` | Query attendance history for a student |
| `POST` | `/api/attendance` | Record single attendance record (validates studentId) |
| `POST` | `/api/attendance/batch` | Batch record attendance (validates studentId) |

### Marks (`/api/marks`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/marks?courseCode=...&examType=...&studentId=...` | Query examination marks |
| `GET` | `/api/marks/student/{studentId}` | Query transcript grades for a student |
| `POST` | `/api/marks` | Record single examination mark (validates studentId) |
| `POST` | `/api/marks/batch` | Batch record examination marks (validates studentId) |

---

## 🛠️ Common Errors & Troubleshooting

1. **`Cannot connect to backend server` (Port 8080)**:
   - Ensure Spring Boot is running via `mvn spring-boot:run` in the `backend/` directory or run `run-backend.bat`.
   - Verify that port 8080 is not occupied by another service (`netstat -ano | findstr 8080`).

2. **`MongoSocketOpenException` / Connection Refused (Port 27017)**:
   - Make sure MongoDB service/mongod daemon is running.
   - Run `mongod --dbpath ./.data/db --port 27017` or use `run-all.bat`.

3. **CORS Issues (`Access to XMLHttpRequest blocked by CORS policy`)**:
   - `CorsConfig.java` allows origins matching `http://localhost:*` and `http://127.0.0.1:*`. If using custom hosts or ports, update `CorsConfig.java`.

4. **Duplicate Student Roll ID (`Conflict` / 400 Bad Request)**:
   - Student roll IDs (e.g. `STU-2024-001`) must be unique. The system enforces uniqueness and displays the exact conflict message in the UI modal.

5. **`Student not found with student ID` on Attendance or Marks**:
   - Both Attendance and Marks enforce database referential integrity. Attempting to record attendance or enter marks for a non-existent student ID will be rejected with an appropriate error.
