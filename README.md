# CodingFacotry – Event Management System

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.5.

## Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

---

# Event Management System – Documentation

## Overview

This is a full-stack web application for managing events, allowing users to create, update, participate in, and track events. It includes:

- **Backend**: Spring Boot RESTful API  
- **Frontend**: Angular SPA  
- **Features**: CRUD for events, image upload, participant registration, PDF pass generation, filtering, and external event integration

---

## Backend API Documentation

### Event Controller (`EventRestController`)

**Base URL:** `/event`

#### Endpoints:

1. **Get All Events**  
   - `GET /retrieve-all-events`  
   - Returns: List of all events (both internal and external)

2. **Get Single Event**  
   - `GET /retrieve-event/{event-id}`  
   - Returns: Event details by ID

3. **Add Event**  
   - `POST /add-event`  
   - Form-data: Event (JSON string) + Image (Multipart file)  
   - Returns: Added event

4. **Delete Event**  
   - `DELETE /remove-event/{event-id}`  
   - Deletes event by ID

5. **Update Event**  
   - `PUT /modify-event`  
   - Form-data: Event (JSON string) + optional new image  
   - Returns: Updated event

6. **Register to Event**  
   - `POST /participate/{event-id}`  
   - Registers the current user to the selected event  
   - Returns: Participation status

7. **Download Event Pass (PDF)**  
   - `GET /download-pass/{event-id}/{username}`  
   - Generates and downloads a personalized PDF pass

8. **Filter Events by Status**  
   - `GET /filter-events?status={status}`  
   - Returns: Events filtered by status (UPCOMING, ONGOING, FINISHED)

9. **Get External Events**  
   - `GET /external-events`  
   - Returns: Events scraped from an external website (not stored in DB)

---

## Frontend Components

### Event Dashboard Component

**Path:** `event-dashboard.component.ts`

#### Features:
- Displays all events (internal and external)
- Filter by event status (Upcoming, Ongoing, Finished)
- Event search and pagination
- Reset filter functionality

#### Key Methods:
- `loadEvents()`: Loads events from backend  
- `filterByStatus()`: Applies status filter  
- `resetFilter()`: Clears applied filters  

---

### Event Form Component

**Path:** `event-form.component.ts`

#### Features:
- Add/Edit event with image upload
- Date/time picker and location input
- Status assignment (UPCOMING, ONGOING, FINISHED)

#### Key Methods:
- `submitEvent()`: Handles form submission  
- `uploadImage()`: Uploads image along with form  
- `resetForm()`: Clears form fields  

---

### Event Details Component

**Path:** `event-details.component.ts`

#### Features:
- Shows event details (name, description, image, etc.)
- Participate button to register and generate pass
- Number of participants displayed

#### Key Methods:
- `getEventById()`: Loads event details  
- `participate()`: Registers and triggers pass download  

---

### External Events Component

**Path:** `external-events.component.ts`

#### Features:
- Displays scraped external events
- Shows external events without saving to DB
- Separate section from internal events

#### Key Methods:
- `loadExternalEvents()`: Fetches scraped data from backend  

---

## Setup Instructions

### Backend (Spring Boot)

1. Install Java 17+  
2. Configure DB in `application.properties`  
3. Use Maven to install dependencies:  
   ```bash
   mvn clean install
