# INSTRUCTIONS.md

## 1. **Project Setup**

1. **Install Dependencies**
   - Navigate to the `Landing` directory.
   - Run `npm install` to install all required dependencies.

2. **Run the Development Server**
   - Use `ng serve` to start the Angular development server.
   - Access the app at `http://localhost:4200/`.

---

## 2. **Project Structure Overview**

- **Front Office (User Section):**  
  Located in `src/app/pages/index` or similar.
- **Back Office (Admin Panel):**  
  Located in `src/app/back-office` (and subfolders).
- **Shared Components/Services:**  
  Located in `src/app/shared`.

---

## 3. **API Integration**

1. **Create Payment Service**
   - In `src/app/shared` or a new `services` folder, create `payment.service.ts`.
   - Implement methods for:
     - `getPayments()` → `GET /api/payments`
     - `getPayment(id)` → `GET /api/payments/{id}`
     - `createPayment(data)` → `POST /api/payments`
     - `updatePayment(id, data)` → `PUT /api/payments/{id}`
     - `deletePayment(id)` → `DELETE /api/payments/{id}`

2. **HTTP Configuration**
   - Use Angular's `HttpClientModule` (already imported in `app.module.ts`).
   - Set the backend API base URL in `environment.ts`.

---

## 4. **UI Components & Pages**

### **Front Office (User Section)**

1. **Payment Management Page**
   - Create a component (e.g., `user-payments`).
   - Display a list of user payments using the payment service.
   - Allow users to add/edit payments via a form dialog.

2. **Invoice Details Page**
   - Create a component (e.g., `invoice-details`).
   - Fetch and display invoice details.
   - Add a button to download invoice as PDF (use backend endpoint).

### **Back Office (Admin Panel Section)**

1. **Payment Management Page**
   - Create a component (e.g., `admin-payments`).
   - Display all payments with options to update or delete.

2. **Total Amount Report**
   - Create a component (e.g., `total-report`).
   - Fetch and display total outstanding and paid amounts.

3. **Payment History**
   - Create a component (e.g., `payment-history`).
   - Display payment history with filters (status: pending, completed, failed).

---

## 5. **Routing and Navigation**

1. **Set Up Routing**
   - Use `app-routing.module.ts` to define routes for:
     - `/` (front office: user pages)
     - `/admin` (back office: admin pages)
   - Remove or ignore routes for login, register, and reset-password if not needed.

2. **Navigation**
   - Update navigation menus in layout components to provide links to user and admin sections.

---

## 6. **State Management**

1. **Use Angular Services**
   - Store and manage payment form state in the payment service.
   - Use RxJS `BehaviorSubject` for reactive state updates.

2. **Form Validation**
   - Use Angular Reactive Forms for all forms.
   - Add validation rules (required fields, number formats, etc.).
   - Display validation feedback in the UI.

---

## 7. **Forms**

1. **Payment Forms**
   - Create forms for adding/editing payments.
   - Use Angular Material or template components for UI consistency.
   - Validate and submit forms to backend via the payment service.

2. **Invoice Details**
   - Display invoice data in a read-only form or card.
   - Add a download button for PDF export.

---

## 8. **Frontend/Backend Sync**

1. **Data Display**
   - Use async pipes or subscribe to observables to display backend data.

2. **CRUD Operations**
   - Ensure all create, update, and delete actions call the correct backend endpoints.
   - Show success/error messages based on API responses.

---

## 9. **Testing & Finalization**

1. **Test All Flows**
   - Test both user and admin sections.
   - Ensure all API calls work and UI updates accordingly.

2. **Polish UI**
   - Use template's styles and components for a consistent look.

3. **Build for Production**
   - Run `ng build --prod` to generate production-ready files.

---

**You can now proceed step by step, following this plan to build your frontend application.**
If you need code examples or help with any specific step, just ask! 