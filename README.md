# 🚀 CodingFactory Platform

A comprehensive web application built to streamline and manage various aspects of an educational and professional development platform. This full-stack system is composed of several microservices and modules, each dedicated to a specific business domain such as user management, project handling, events, freelancing, and more.

---

## 🏗️ Architecture Overview

The application is built using:
- **Angular** (frontend)
- **Spring Boot** (backend microservices)
- **MySQL / PostgreSQL** (database)
- **JWT** for authentication and authorization
- **REST APIs** for inter-service communication

---

## 📦 Modules

### 👤 User & Candidate Management

- Secure user registration & authentication (JWT)
- Role-based access control (Admin, Student, Freelancer)
- Candidate profile creation and CV management
- Account update and deletion

---

### 🗂️ Project Management

- Create, update, delete internal and external projects
- Assign members to projects
- Track project progress and deadlines
- Project categorization and filtering

---

### 📅 Event Management

- Organize internal and public events
- Event participation with registration tracking
- Generate personalized PDF passes for participants
- Event filtering (past, upcoming, all)
- Admin event dashboard for analytics

---

### 📝 Blog & Freelance Listings

- Display blogs and articles written by students or freelancers
- Freelance project board: list available missions
- Freelancer profile showcase
- Apply and manage freelance opportunities

---

### 💸 Payment & Scholarship Handling

- Handle freelance payments securely
- Integrate scholarship requests and management
- Admin dashboard for financial overview
- Fraud detection using ML (Decision Tree Regressor model)

---

### 🎓 Internships & Final Year Projects

- List and manage internship and PFE offers
- Companies can post available positions
- Students can apply and upload required documents
- Assign mentors and track project progress

---

### 📚 Courses, Evaluation & Certifications

- Display available courses by domain
- Course enrollment system
- Certification generation upon completion
- Evaluation and quiz system
- Admin dashboard for managing evaluations

---

## 🛠️ Technologies Used

- **Frontend:** Angular 17, ng2-charts, TailwindCSS
- **Backend:** Spring Boot, Spring Security, Spring Data JPA
- **Database:** MySQL 
- **Authentication:** JWT Tokens
- **Tools:** Git, Maven, Postman, 

---

## ⚙️ Setup Instructions

1. **Clone the repo**
```bash
git clone https://github.com/TiTa033/PIDEV_Projet_integration_developpement_CodingFactory.git
