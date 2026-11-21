# BankSphere – Online Banking Portal

BankSphere is a web-based banking portal with separate interfaces for customers and bank administrators. Customers can manage their accounts and banking activities, while administrators can monitor customers, accounts, transactions, loan requests, and complaints.

## Features

### Customer Portal
- Customer registration, login, and password recovery screen
- Customer dashboard with account balance and banking overview
- View account information and debit card details
- Transfer money to registered beneficiaries
- View, search, and filter transaction history
- Download transaction statements in CSV format
- Add and manage beneficiaries
- Explore loan products, submit loan applications, and use the EMI calculator
- Submit complaints and track their status
- View notifications and alerts
- Manage profile and account settings

### Admin Portal
- Admin dashboard with banking overview and summary statistics
- View and manage customer records
- View account information and account ledger
- Monitor transactions
- Review and process loan applications
- Review and resolve customer complaints
- Access reports and audit-related screens

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, React Router |
| UI and charts | CSS, Tailwind CSS, Lucide React, Recharts |
| HTTP requests | Axios |
| Backend | Java 17, Spring Boot 4 |
| Security | Spring Security, JWT, BCrypt password encoder |
| Persistence | Spring Data JPA, Hibernate |
| Database | MySQL |
| Build tools | npm, Maven |

## Project Structure

The project contains two applications:

```text
BankSphere/
├── banksphere-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   └── customer/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
│
└── banksphere-backend/
    ├── src/main/java/com/banksphere/
    │   ├── config/
    │   ├── controller/
    │   ├── dto/
    │   ├── entity/
    │   ├── repository/
    │   ├── security/
    │   └── service/
    ├── src/main/resources/
    └── pom.xml
```

## Prerequisites

Install the following before running the project:

- Node.js and npm
- Java Development Kit (JDK) 17
- Maven
- MySQL Server

## Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd BankSphere
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with the URL of your GitHub repository. If you uploaded the frontend and backend as separate repositories, clone each repository and run the corresponding commands from its project directory.

### 2. Set up the MySQL database

Start MySQL and create the database:

```sql
CREATE DATABASE banksphere;
```

The backend is configured to use a local MySQL database named `banksphere`. Update the database connection settings for your own environment before starting the backend.

### 3. Configure the backend

Open:

```text
banksphere-backend/src/main/resources/application.properties
```

Set your local database username and password, and configure a strong JWT secret. Do not commit real credentials or secret keys to GitHub.

Example configuration:

```properties
spring.application.name=banksphere-backend

spring.datasource.url=jdbc:mysql://localhost:3306/banksphere
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080

jwt.secret=YOUR_BASE64_ENCODED_SECRET
jwt.expiration=86400000
```

For production, keep secrets in environment variables or a secrets manager, use a suitably strong secret, and review the database schema-management setting before deployment.

### 4. Run the backend

Open a terminal:

```bash
cd banksphere-backend
mvn spring-boot:run
```

The backend is configured to run at:

```text
http://localhost:8080
```

The frontend API client uses `http://localhost:8080/api` as its default API base URL.

### 5. Configure and run the frontend

Open another terminal:

```bash
cd banksphere-frontend
npm install
```

Create a `.env` file in the `banksphere-frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Start the development server:

```bash
npm run dev
```

Vite will display the local frontend URL in the terminal. The default development URL is:

```text
http://localhost:5173
```

The backend CORS configuration in the supplied source currently allows `http://localhost:5173`. If you use a different frontend origin or deploy the application, update the backend CORS allowed origin accordingly.

## Useful Commands

### Frontend

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build
npm run lint      # Run Oxlint
```

### Backend

```bash
mvn spring-boot:run   # Run the Spring Boot application
mvn clean package     # Build the backend JAR
mvn test              # Run backend tests
```

## Authentication and Security

- The backend uses Spring Security and stateless session management.
- JWT bearer tokens are used for authenticated API requests.
- The frontend Axios client reads the stored authentication token and attaches it to outgoing requests.
- Passwords are handled with BCrypt through Spring Security's password encoder.
- Protected backend routes require authentication; the `/api/auth/**` routes are configured as public.

This project is intended as an educational/demo banking application. Do not use it to handle real money, real banking credentials, or sensitive customer information without a full security, compliance, and infrastructure review.

## Notes

- Configure your own MySQL credentials and JWT secret before running the backend.
- Do not upload `.env` files, database passwords, JWT secrets, or other credentials to GitHub.
- Ensure the frontend API base URL and backend CORS origin match your local or deployed environment.
- The supplied frontend includes context and data modules; confirm the backend connection and environment configuration for the workflow you intend to run.

## License

No license has been specified for this project. Add a `LICENSE` file if you want to publish it under an open-source license.
