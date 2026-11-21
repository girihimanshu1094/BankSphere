# BankSphere – Online Banking Portal (MCA Major Project)

An enterprise-inspired, simulated online banking web application frontend developed for an **MCA Final-Year Major Project examination and viva demonstration**.

Built with **React.js, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React, and Recharts**.

---

## 🌟 Key Features

### 1. Customer NetBanking Portal
- **Dashboard**:
  - Live summary metrics: Available Balance, Primary Account Number, Monthly Inflow/Outflow.
  - Interactive monthly cashflow chart (Recharts bar chart).
  - Quick action buttons: Simulated Instant Deposit, Withdrawal, Transfer, and Statement.
  - Recent transactions table with click-to-view printable transaction advice slips.
- **My Account**:
  - Detailed account profile with IFSC code, home branch, nominee, and opening date.
  - Simulated Visa Platinum International debit card with toggle to reveal card number, CVV, and limits.
  - Overview of linked term deposits and fixed deposit accounts.
- **Transfer Money**:
  - Select source account with live balance validation (preventing negative or over-balance transfers).
  - Choose from saved beneficiaries or perform a one-time transfer.
  - Mode selection: IMPS, NEFT, RTGS.
  - Two-step confirmation dialog.
  - Instant balance deduction and real-time generation of UTR/reference number.
- **Transaction History**:
  - Full audit ledger with multi-field search and filters by date range, transaction type, and status.
  - Printable electronic transaction advice.
  - **Export Statement**: One-click download as CSV.
- **Beneficiary Management**:
  - Add, edit, delete (with confirmation dialog), and search verified payees.
- **Loans & Financial Services**:
  - Catalog of personal, education, home, and vehicle loans.
  - Built-in **Interactive EMI & Interest Estimator** with dynamic sliders.
  - Digital loan application form.
  - Status tracking with administrative review notes.
- **Complaints & Grievance Redressal**:
  - Lodge tickets by category (UPI/Transaction failure, Card, Net Banking, Fraud).
  - Status progression tracking (`Submitted` → `In Progress` → `Resolved`) with official bank resolution notes.
- **Notifications & Alerts**:
  - Notification feed for deposits, debits, loan sanctions, and ticket updates.
  - Mark read and delete controls with top navbar unread counter badge.
- **Profile & Security**:
  - View KYC dossier and edit personal contact information.
  - Simulated password update form.

### 2. Admin Command Center
- **Admin Dashboard**:
  - Metrics: Total Customers, Accounts, Clearings, Vault Capital Reserves, Pending Tasks.
  - Charts: 12-Month gross turnover area chart and account composition pie chart.
  - High-priority action queues for pending loans and grievances.
- **Customer Management**:
  - Search, filter by active/blocked, and inspect full customer dossiers.
  - Action buttons to **Block** or **Unblock** customer accounts with confirmation modals.
  - **Add New Customer** modal to simulate onboarding new banking accounts.
- **Accounts Ledger**:
  - Master bank accounts table across all customer accounts and branches.
- **Transaction Monitoring**:
  - Real-time audit log of all clearing transfers with detailed audit slip view.
- **Loan Appraisal Desk**:
  - Review applicant financial profiles.
  - **Approve** loan or **Reject** loan with mandatory administrative remarks.
  - *Directly syncs with the customer's portal and notifications in real time!*
- **Complaints Desk**:
  - Review tickets, update status, and write official resolution responses.
- **Banking Audit & Reports**:
  - Customer onboarding trends, loan portfolio breakdown, clearing tables, and printable audit sheets.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern component-based frontend framework |
| **Vite** | Fast build tool and dev server |
| **JavaScript (ES6+)** | Clean, understandable vanilla JavaScript |
| **Tailwind CSS v3** | Professional banking navy & slate color palette |
| **React Router DOM v7** | Client-side routing with layout wrappers & guards |
| **Axios** | HTTP client prepared for Spring Boot REST API |
| **Lucide React** | Lightweight, modern banking icons |
| **Recharts** | Interactive SVG charts (Bar, Area, Pie, Line) |

---

## 🚀 How to Run the Application

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation & Launch

1. Navigate to the project root directory:
   ```bash
   cd banksphere-frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open the browser at the local Vite URL (typically `http://localhost:5173`).

---

## 🔑 Demo Login Credentials

For college project demonstrations and viva evaluation, 1-click quick login buttons are provided on the login page:

| Role | Email / User ID | Password | Quick Login |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@banksphere.com` | `customer123` | Click **"Customer Demo"** button |
| **Admin** | `admin@banksphere.com` | `admin123` | Click **"Admin Demo"** button |

---

## 📂 Project Structure

```text
banksphere-frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── assets/
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.jsx           # Top header with date, notifs, profile dropdown
    │   │   ├── Sidebar.jsx          # Collapsible responsive customer/admin sidebar
    │   │   ├── StatCard.jsx         # Summary metrics widget
    │   │   ├── StatusBadge.jsx      # Color-coded badge for statuses
    │   │   ├── Modal.jsx            # Reusable accessible dialog modal
    │   │   └── ConfirmDialog.jsx    # Action confirmation dialogs
    │   ├── forms/
    │   │   ├── FormInput.jsx        # Reusable input with validation & icons
    │   │   └── FormSelect.jsx       # Reusable styled select dropdown
    │   └── tables/
    │       └── DataTable.jsx        # Table with search, pagination & empty states
    ├── layouts/
    │   ├── AuthLayout.jsx           # Clean centered auth layout with banking trust badges
    │   ├── CustomerLayout.jsx       # NetBanking layout with customer sidebar & navbar
    │   └── AdminLayout.jsx          # Admin layout with management navigation
    ├── context/
    │   ├── AuthContext.jsx          # Session state, login, logout, demo quick-fill
    │   └── BankDataContext.jsx     # Reactive global state for accounts, loans, complaints, txns
    ├── data/
    │   ├── mockData.js              # Rich Indian banking seed data (accounts, IFSC, txns)
    │   └── mockStorage.js           # LocalStorage synchronization layer
    ├── services/
    │   ├── api.js                   # Central Axios client with JWT token interceptors
    │   ├── authService.js           # Authentication & profile endpoints
    │   ├── accountService.js        # Account balances, deposit/withdraw
    │   ├── transactionService.js    # Transfer money, filters, statement CSV download
    │   ├── beneficiaryService.js    # Payee CRUD operations
    │   ├── loanService.js           # Products, EMI calculator, application submissions
    │   ├── complaintService.js      # Grievance registration & tracking
    │   └── adminService.js          # Admin approvals, customer freezing, reporting
    ├── utils/
    │   ├── formatters.js            # INR currency (₹), Indian dates, account masking
    │   └── validators.js            # Email, phone, IFSC, and amount validation
    ├── pages/
    │   ├── auth/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── ForgotPasswordPage.jsx
    │   ├── customer/
    │   │   ├── CustomerDashboard.jsx
    │   │   ├── MyAccountPage.jsx
    │   │   ├── TransferMoneyPage.jsx
    │   │   ├── TransactionsPage.jsx
    │   │   ├── BeneficiariesPage.jsx
    │   │   ├── LoansPage.jsx
    │   │   ├── ComplaintsPage.jsx
    │   │   ├── NotificationsPage.jsx
    │   │   └── ProfilePage.jsx
    │   ├── admin/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminCustomersPage.jsx
    │   │   ├── AdminAccountsPage.jsx
    │   │   ├── AdminTransactionsPage.jsx
    │   │   ├── AdminLoansPage.jsx
    │   │   ├── AdminComplaintsPage.jsx
    │   │   └── AdminReportsPage.jsx
    │   └── NotFoundPage.jsx
    ├── App.jsx                      # Route hierarchy with role guards
    ├── main.jsx                     # React DOM entry point
    └── index.css                    # Tailwind CSS directives & banking print styles
```

---

## 🔄 Currently Simulated Features

All banking interactions operate through a reactive state manager (`BankDataContext`) synchronized with browser `localStorage`:

1. **Balance & Fund Transfers**: Executing a transfer immediately reduces the selected account's available balance, prepends the new transaction to history, generates a reference number, and alerts the customer via notification.
2. **Instant Deposits & Withdrawals**: Modals simulate cash deposits or counter withdrawals and instantly adjust balances.
3. **Cross-Role Loan Approval Workflow**:
   - Customer submits a loan request → shows as `Pending`.
   - Admin logs in → navigates to **Loan Requests** → clicks **Approve** or **Reject with Reason**.
   - Customer logs in → sees the loan application status updated to `Approved` or `Rejected` with the admin's remarks, plus an alert notification.
4. **Cross-Role Grievance Resolution Workflow**:
   - Customer logs a complaint ticket.
   - Admin updates status to `In Progress` or `Resolved` and appends an official response.
   - Customer sees the resolution note on their complaints page.
5. **Customer Freezing**: Admin can block an account; the change reflects across customer listings.
6. **Data Reset**: Clearing browser `localStorage` or resetting via `mockStorage.resetAllData()` returns the application to fresh seed data.

---

## 🔌 Connecting to Spring Boot & MySQL

The frontend has been organized with a standard service layer architecture (`src/services/api.js`). To connect to your Spring Boot REST API:

1. Create a `.env` file in `banksphere-frontend/`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
2. Your Spring Boot controllers should match the following standard endpoints:
   - `POST /api/auth/login` (returns `{ token: string, user: User, role: string }`)
   - `POST /api/auth/register`
   - `GET /api/accounts/primary` & `GET /api/accounts`
   - `POST /api/transactions/transfer` (body: `{ sourceAccountNumber, beneficiaryAccountNumber, amount, remarks, transferType }`)
   - `GET /api/transactions` (supports query params: `?search=&type=&status=&startDate=&endDate=`)
   - `GET /api/beneficiaries` & `POST /api/beneficiaries` & `DELETE /api/beneficiaries/{id}`
   - `GET /api/loans` & `POST /api/loans/apply`
   - `PUT /api/admin/loans/{id}/status` (body: `{ status: "Approved" | "Rejected", adminRemarks: string }`)
   - `GET /api/complaints` & `POST /api/complaints`
   - `PUT /api/admin/complaints/{id}/status` (body: `{ status: string, response: string }`)
   - `PUT /api/admin/customers/{id}/block` & `PUT /api/admin/customers/{id}/unblock`
3. In `src/services/*.js`, simply replace the mock data fallback lines with the existing `api.get(...)` and `api.post(...)` calls. The JWT authentication header is already pre-configured in `src/services/api.js`!
