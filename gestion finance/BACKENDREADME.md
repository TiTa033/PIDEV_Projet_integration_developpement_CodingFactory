# BACKENDREADME.md

## Overview

This backend powers the "Gestion Finance" application, exposing RESTful APIs for payment and invoice management. It is built with **Spring Boot 3**, **Java 17**, and **MySQL**. The backend is designed to be consumed by an Angular frontend and provides all necessary endpoints for payment, invoice, and reporting features.

---

## Key Information for Frontend Developers

### 1. **Base URL**

All API endpoints are prefixed with:

```
http://localhost:8080/api/api/payments
```

CORS is enabled for `http://localhost:4200` (the Angular frontend).

---

### 2. **Main API Endpoints**

| Method | Endpoint                                      | Description                        | Body/Params         |
|--------|-----------------------------------------------|------------------------------------|---------------------|
| POST   | `/api/api/payments`                               | Create a payment                   | Payment JSON        |
| PUT    | `/api/api/payments/{id}`                          | Update a payment                   | Payment JSON        |
| DELETE | `/api/api/payments/{id}`                          | Delete a payment                   | -                   |
| GET    | `/api/api/payments/{id}`                          | Get a payment by ID                | -                   |
| GET    | `/api/api/payments/all`                           | Get all payments                   | -                   |
| POST   | `/api/api/payments/invoices`                      | Create an invoice                  | Invoice JSON        |
| POST   | `/api/api/payments/invoices/{id}/send?email=...`  | Send invoice by email              | -                   |
| GET    | `/api/api/payments/invoices/{id}/pdf`             | Download invoice PDF               | -                   |
| GET    | `/api/api/payments/reports?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | Payment report | - |
| GET    | `/api/api/payments/overdue`                       | Get overdue payments               | -                   |
| GET    | `/api/api/payments/statistics/outstanding`        | Get total outstanding amount       | -                   |
| GET    | `/api/api/payments/statistics/paid`               | Get total paid amount              | -                   |

---

### 3. **Data Models**

#### **Payment**

```json
{
  "id": 1,
  "amount": 100.0,
  "method": "CARD", // or BANK, CASH
  "status": "PENDING", // or COMPLETED, FAILED
  "paymentDate": "2024-06-01",
  "dueDate": "2024-06-10",
  "invoice": { "id": 1 },
  "createdAt": "2024-06-01T12:00:00",
  "updatedAt": "2024-06-01T12:00:00"
}
```

- **method**: `"CARD"`, `"BANK"`, `"CASH"`
- **status**: `"PENDING"`, `"COMPLETED"`, `"FAILED"`
- **Dates**: Use `YYYY-MM-DD` format for `paymentDate` and `dueDate`.

#### **Invoice**

```json
{
  "id": 1,
  "totalAmount": 100.0,
  "dueDate": "2024-06-10",
  "isPaid": false,
  "recipientEmail": "customer@example.com",
  "installments": [
    {
      "id": 1,
      "amount": 50.0,
      "dueDate": "2024-06-05",
      "isPaid": false
    }
  ],
  "createdAt": "2024-06-01T12:00:00",
  "updatedAt": "2024-06-01T12:00:00"
}
```

#### **Installment**

```json
{
  "id": 1,
  "amount": 50.0,
  "dueDate": "2024-06-05",
  "isPaid": false
}
```

---

### 4. **Enum Values**

- **PaymentMethod**: `"CARD"`, `"BANK"`, `"CASH"`
- **PaymentStatus**: `"PENDING"`, `"COMPLETED"`, `"FAILED"`

**These values are case-sensitive and must match exactly.**

---

### 5. **Special Endpoints**

- **Download Invoice PDF**:  
  `GET /api/api/payments/invoices/{id}/pdf`  
  Returns a PDF file (set correct headers in frontend for download).

- **Send Invoice by Email**:  
  `POST /api/api/payments/invoices/{id}/send?email=recipient@example.com`  
  Triggers email sending (requires email config in backend).

- **Reports**:  
  `GET /api/api/payments/reports?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`  
  Returns a summary report for the given date range.

- **Statistics**:  
  - `/statistics/outstanding`: Total outstanding amount.
  - `/statistics/paid`: Total paid amount.

---

### 6. **Validation & Error Handling**

- All required fields must be present in POST/PUT requests.
- Dates must be in `YYYY-MM-DD` format.
- Enum values must match exactly.
- On validation errors, backend returns `400 Bad Request` with details.

---

### 7. **Swagger/OpenAPI Documentation**

- Once the backend is running, access API docs at:  
  [http://localhost:8080/api/swagger-ui.html](http://localhost:8080/api/swagger-ui.html)

---

### 8. **Development Notes**

- The backend context path is `/api`.
- All endpoints are under `/api/api/payments`.
- CORS is enabled for the Angular frontend.
- If you encounter issues, check the backend logs for error details.

---

### 9. **Tips for Frontend Integration**

- Always use the correct enum values and date formats.
- Use the `/all` endpoint for listing payments.
- Use the `/statistics` endpoints for dashboard/reporting widgets.
- Use the `/invoices/{id}/pdf` endpoint for invoice downloads.
- Use the `/reports` endpoint for generating reports by date range.

---

If you need more details about any endpoint or data structure, refer to the backend Swagger UI or ask the backend team. 