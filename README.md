# Landsay

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

# Certification Management System - Documentation

## Overview

This project is a full-stack application for managing certifications, courses, and evaluations. It includes:

- Backend: Spring Boot REST API
- Frontend: Angular application
- Features: Certification management, course tracking, evaluation scheduling, QR code generation, PDF export, and more

## Backend API Documentation

### Certification Controller (`CertificationRestController`)

**Base URL:** `/certification`

#### Endpoints:

1. **Get All Certifications**
   - `GET /retrieve-all-certifications`
   - Returns: List of all certifications

2. **Get Single Certification**
   - `GET /retrieve-certification/{certification-id}`
   - Returns: Single certification by ID

3. **Add Certification**
   - `POST /add-certification`
   - Body: Certification object
   - Returns: Added certification

4. **Delete Certification**
   - `DELETE /remove-certification/{certification-id}`
   - Deletes certification by ID

5. **Update Certification**
   - `PUT /modify-certification`
   - Body: Updated certification object
   - Returns: Updated certification

6. **Generate QR Code**
   - `GET /generate-qrcode/{certification-id}`
   - Returns: Base64 encoded QR code image
   - QR code color changes based on certification status (red for expired, green for valid)

7. **Download Certification PDF**
   - `GET /download-certification/{certification-id}`
   - Returns: PDF file of the certification

8. **Verify Certification from Image**
   - `POST /verify-certification-image`
   - Parameters: Image file (MultipartFile)
   - Uses OCR to extract text and verifies against database
   - Returns: Verification result

### Course Controller (`CourseRestController`)

**Base URL:** `/course`

#### Endpoints:

1. **Get All Courses**
   - `GET /retrieve-all-courses`
   - Returns: List of all courses

2. **Get Single Course**
   - `GET /retrieve-course/{course-id}`
   - Returns: Single course by ID

3. **Add Course**
   - `POST /add-course`
   - Body: Course object (validated)
   - Returns: Added course

4. **Delete Course**
   - `DELETE /remove-course/{course-id}`
   - Deletes course by ID

5. **Update Course**
   - `PUT /modify-course`
   - Body: Updated course object (validated)
   - Returns: Updated course

6. **Update Course Tags**
   - `PUT /{courseId}/update-tags`
   - Body: List of new tags
   - Returns: Updated course

7. **Rate Course**
   - `PUT /rate-course/{course-id}/{rating}`
   - Updates course rating
   - Returns: Updated course

### Evaluation Controller (`EvaluationRestController`)

**Base URL:** `/evaluation`

#### Endpoints:

1. **Get All Evaluations**
   - `GET /retrieve-all-evaluations`
   - Returns: List of all evaluations

2. **Get Single Evaluation**
   - `GET /retrieve-evaluation/{evaluation-id}`
   - Returns: Single evaluation by ID

3. **Add Evaluation**
   - `POST /add-evaluation`
   - Body: Evaluation object
   - Returns: Added evaluation

4. **Delete Evaluation**
   - `DELETE /remove-evaluation/{evaluation-id}`
   - Deletes evaluation by ID

5. **Update Evaluation**
   - `PUT /modify-evaluation`
   - Body: Updated evaluation object
   - Returns: Updated evaluation

6. **Get Upcoming Evaluations**
   - `GET /upcoming-evaluations`
   - Returns: List of upcoming evaluations

7. **Get Completed Evaluations**
   - `GET /completed-evaluations`
   - Returns: List of completed evaluations

## Frontend Components

### Features Component

**Path:** `features.component.ts`

#### Features:
- Course listing with pagination
- Course rating system
- Search functionality
- Favorites management
- Social sharing
- Comment system
- Chatbot integration
- Weather information
- SMS sending via Twilio

#### Key Methods:
- `getCourses()`: Loads and paginates courses
- `rateCourse()`: Handles course rating
- `toggleFavorite()`: Manages favorite courses
- `shareCourse()`: Shares course on social media
- `addComment()`: Adds comments to courses
- `sendMessage()`: Handles chatbot interaction
- `getWeather()`: Fetches weather data
- `sendSms()`: Sends SMS via Twilio

### Clients Component

**Path:** `clients.component.ts`

#### Features:
- Evaluation calendar view
- Map display of evaluation locations
- Upcoming/completed evaluation filtering
- Drag-and-drop rescheduling

#### Key Methods:
- `loadEvaluations()`: Loads all evaluation data
- `updateCalendarEvents()`: Updates calendar display
- `updateMapMarkers()`: Updates map markers
- `handleEventDrop()`: Handles calendar event rescheduling
- `handleEventClick()`: Shows evaluation details

### Pricing Component

**Path:** `pricing.component.ts`

#### Features:
- Certification management
- QR code generation
- PDF/PNG/JPEG certificate export
- Certification status tracking
- Sharing functionality

#### Key Methods:
- `loadCertifications()`: Loads certifications with QR codes
- `download()`: Exports certificate in various formats
- `share()`: Shares certification on LinkedIn
- `getStatusClass()`: Returns CSS class based on status
- `getStatusText()`: Returns status display text

## Setup Instructions

### Backend (Spring Boot)
1. Ensure Java 17+ is installed
2. Configure database connection in `application.properties`
3. Install dependencies with Maven
4. Run the Spring Boot application

### Frontend (Angular)
1. Install Node.js and npm
2. Install Angular CLI: `npm install -g @angular/cli`
3. Install dependencies: `npm install`
4. Run development server: `ng serve`

## Dependencies

### Backend:
- Spring Boot 3.x
- Spring Data JPA
- Lombok
- ZXing (QR code generation)
- OpenPDF (PDF generation)
- Tesseract (OCR)

### Frontend:
- Angular 15+
- Leaflet (maps)
- FullCalendar
- pdfmake (PDF generation)
- html2canvas (image export)
- OpenWeatherMap API
- Twilio API

## Additional Features

- **QR Code Verification**: Certifications can be verified by scanning QR codes
- **OCR Integration**: Certifications can be verified from images
- **Responsive Design**: Works on desktop and mobile
- **Local Storage**: Persists favorites and comments
- **Interactive Calendar**: Drag-and-drop evaluation rescheduling
- **Geolocation**: Map display of evaluation locations

## Security Notes

- CORS configured for `http://localhost:4200`
- Input validation on course endpoints
