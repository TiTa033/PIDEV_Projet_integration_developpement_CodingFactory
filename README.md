# CodingFactory– Project Management System

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.5.

## Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

---

# Project Management System – Documentation

## Overview

This is a full-stack web application for managing and showcasing IT-related student projects. It includes:

- **Backend**: Spring Boot RESTful API  
- **Frontend**: Angular SPA  
- **Features**: Project CRUD operations, file uploads/downloads, search by tags/name, responsive UI, and advanced filtering

---

## Backend API Documentation

### Project Controller (`ProjectRestController`)

**Base URL:** `/project`

#### Endpoints:

1. **Get All Projects**  
   - `GET /retrieve-all-projects`  
   - Returns: List of all projects

2. **Get Single Project**  
   - `GET /retrieve-project/{project-id}`  
   - Returns: Project details by ID

3. **Add Project**  
   - `POST /add-project`  
   - Body: Project object (JSON)  
   - Returns: Added project

4. **Delete Project**  
   - `DELETE /remove-project/{project-id}`  
   - Deletes project by ID

5. **Update Project**  
   - `PUT /modify-project`  
   - Body: Updated project object  
   - Returns: Modified project

6. **Search Projects**  
   - `GET /search?keyword={term}`  
   - Returns: List of projects matching keyword (title, tags, or description)

7. **Upload Project Files**  
   - `POST /upload-files/{project-id}`  
   - Multipart upload of documents, images, or code  
   - Returns: Upload status

8. **Download Project Files**  
   - `GET /download-files/{project-id}`  
   - Returns: Zipped folder of all associated files

---

## Frontend Components

### Project Dashboard Component

**Path:** `project-dashboard.component.ts`

#### Features:
- Displays list of all projects
- Real-time filtering by title or tags
- Paginated and responsive UI

#### Key Methods:
- `loadProjects()`: Fetches project data from backend  
- `searchProjects()`: Filters results based on keyword  
- `selectProject()`: Displays project details  

---

### Project Details Component

**Path:** `project-details.component.ts`

#### Features:
- Shows individual project details (title, description, files, tags)
- File download feature
- Modal view for documents or images

#### Key Methods:
- `getProjectById()`: Loads project details  
- `downloadFiles()`: Downloads all related files  

---

### Project Form Component

**Path:** `project-form.component.ts`

#### Features:
- Used for both creating and editing projects
- Drag-and-drop file upload
- Tag and category assignment

#### Key Methods:
- `submitProject()`: Handles form submission  
- `uploadFiles()`: Handles file upload  
- `resetForm()`: Clears the form after submission  

---

## Setup Instructions

### Backend (Spring Boot)

1. Install Java 17+
2. Configure DB in `application.properties`
3. Use Maven to install dependencies:  
   ```bash
   mvn clean install
