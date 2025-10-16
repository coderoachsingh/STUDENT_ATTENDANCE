# ☁️ Attendance Cloud: Full-Stack Student Attendance Portal

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://studentattendance-seven.vercel.app/login.html)
[![Backend API](https://img.shields.io/badge/Backend_API-Render-46E3B7?style=for-the-badge&logo=render)](https://student-attendance-gh4e.onrender.com)

**Attendance Cloud** is a complete, full-stack web application designed to streamline attendance tracking for educational institutions. It features two distinct, secure portals: one for students to view their records and another for teachers to manage attendance.

The entire application is deployed on modern, serverless, and PaaS cloud infrastructure.

---

### ## ✨ Key Features

| Student Portal | Teacher Portal |
| :--- | :--- |
| 🔐 Secure login with Roll Number and Email. | 🔑 Secure login for authorized faculty. |
| 📊 Dynamic dashboard with overall attendance percentage. | 📋 Load a full list of students for any class. |
| 📉 Highlights subjects with attendance below 75%. | 📅 Select subject and date to mark attendance. |
| 📜 Detailed, subject-wise attendance summary. | ✅ Mark students as 'Present', 'Absent', or 'Cancelled'. |
| 👤 Personalized student profile page. | 🚀 Submit attendance for the entire class in one click. |

---

### ## 🚀 Tech Stack & Architecture

This project is built with a modern, decoupled architecture, separating the backend API from the frontend clients.

| Category | Technology |
| :--- | :--- |
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| **Backend** | Node.js, Express.js |
| **Database** | AWS DynamoDB (NoSQL) |
| **Authentication**| JSON Web Tokens (JWT) |
| **Deployment** | **Vercel** (Frontends), **Render** (Backend API) |



The backend is a RESTful API server that handles all business logic, database interactions, and authentication. The two frontends (Student and Teacher) are static sites that act as clients, consuming data from the API.

---

### ## 💻 Local Development Setup

To run this project on your local machine, follow these steps.

#### **Prerequisites**
* Node.js (v18 or later)
* An AWS Account with an IAM User configured with programmatic access.
* VS Code with the **Live Server** extension.

#### **1. Clone the Repository**
```bash
git clone [https://github.com/coderoachsingh/Attendance_CLOUD.git](https://github.com/coderoachsingh/Attendance_CLOUD.git)
cd Attendance_CLOUD


