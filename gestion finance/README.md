# Gestion Finance Backend

This is the backend for the Gestion Finance application, built with Spring Boot 3, Java 17, and MySQL.

## Requirements

- Java 17+
- Maven 3.6+
- MySQL 8+

## Setup

1. **Clone the repository**  
   ```bash
   git clone <your-repo-url>
   cd gestion\ finance
   ```

2. **Configure the database**  
   Edit `src/main/resources/application.properties`:
   ```
   spring.datasource.url=jdbc:mysql://localhost:3306/gestionfinance?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```
   The database will be created automatically if it does not exist.

3. **Configure email (optional, for invoice sending)**  
   ```
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-app-specific-password
   ```

4. **Run the application**  
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on [http://localhost:8080/api](http://localhost:8080/api).

## Main Dependencies

- Spring Boot (Web, Data JPA, Validation, Mail)
- MySQL Connector
- Lombok
- Springdoc OpenAPI (Swagger UI at `/api/swagger-ui.html`)
- iTextPDF (for invoice PDF generation)

## API Endpoints

All endpoints are prefixed with `/api/payments` and support CORS for `http://localhost:4200` (Angular frontend).

| Method | Endpoint                        | Description                        | Body/Params         |
|--------|---------------------------------|------------------------------------|---------------------|
| POST   | `/api/payments`                 | Create a payment                   | Payment JSON        |
| PUT    | `/api/payments/{id}`            | Update a payment                   | Payment JSON        |
| DELETE | `/api/payments/{id}`            | Delete a payment                   | -                   |
| GET    | `/api/payments/{id}`            | Get a payment by ID                | -                   |
| GET    | `/api/payments/all`             | Get all payments                   | -                   |
| POST   | `/api/payments/invoices`        | Create an invoice                  | Invoice JSON        |
| POST   | `/api/payments/invoices/{id}/send?email=...` | Send invoice by email   | -                   |
| GET    | `/api/payments/invoices/{id}/pdf`| Download invoice PDF               | -                   |
| GET    | `/api/payments/reports?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | Payment report | - |
| GET    | `/api/payments/overdue`         | Get overdue payments               | -                   |
| GET    | `/api/payments/statistics/outstanding` | Get total outstanding amount | -                   |
| GET    | `/api/payments/statistics/paid` | Get total paid amount              | -                   |

### Example Payment JSON

```json
{
  "amount": 100.0,
  "method": "CARD", // or BANK, CASH
  "status": "PENDING", // or COMPLETED, FAILED
  "paymentDate": "2024-06-01",
  "dueDate": "2024-06-10",
  "description": "Payment for invoice #123",
  "invoice": { "id": 1 }
}
```

### Example Invoice JSON

```json
{
  "totalAmount": 100.0,
  "dueDate": "2024-06-10",
  "isPaid": false,
  "recipientEmail": "customer@example.com"
}
```

## Notes for Frontend Developers

- All dates should be sent in `YYYY-MM-DD` format.
- Enum values for `method` and `status` must match exactly (`CARD`, `BANK`, `CASH`, `PENDING`, `COMPLETED`, `FAILED`).
- The backend context path is `/api`, so all API calls should be to `/api/payments/...`.
- If you get a `400 Bad Request`, check that your JSON matches the backend model and all required fields are present.

## Running Tests

```bash
./mvnw test
```

## API Documentation

Once the backend is running, access Swagger UI at:  
[http://localhost:8080/api/swagger-ui.html](http://localhost:8080/api/swagger-ui.html) 