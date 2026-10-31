# WealthWise – Financial Habit Builder & Wealth Growth Tracker

<p align="center">
  <strong>Track Today. Build a Wealthier Tomorrow.</strong>
</p>

<p align="center">
  A full-stack personal finance and habit-tracking application designed to help students and young professionals manage money, build better financial habits, and track their wealth.
</p>

<p align="center">
  <a href="https://wealthwise-frontend-ept5.onrender.com">Live Demo</a> •
  <a href="https://github.com/Sandeep8217/financial-habit-builder">GitHub Repository</a>
</p>

---

## Overview

**WealthWise** is a full-stack financial management application that brings expense tracking, budgeting, savings goals, habit building, and net-worth management into one platform.

It provides users with a centralized dashboard to understand their financial activities, monitor progress, and develop healthier money-management habits.

The application uses a React frontend, Spring Boot backend, PostgreSQL database, and JWT-based authentication.

## Features

### 1. Authentication & Security
- User registration and login.
- JWT-based authentication.
- Protected application routes.
- User-specific data isolation.

### 2. Dashboard & Analytics
- Monthly income and expense overview.
- Cash-flow visualization.
- Financial summaries.
- Spending and savings insights.

### 3. Transaction Management
- Manually record income and expenses.
- Organize transactions by category.
- View and manage transaction history.

### 4. Budget Management
- Create monthly budgets.
- Track spending against budget limits.
- Monitor budget utilization.

### 5. Savings Goals
- Create personalized savings goals.
- Track contributions.
- Monitor savings progress.

### 6. Habit Tracking
- Build consistent financial habits.
- Track daily habit completion.
- Monitor streaks and progress.

### 7. Wealth Management
- Track financial assets.
- Record liabilities.
- Automatically calculate net worth.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Java, Spring Boot |
| Security | Spring Security, JWT |
| Database | PostgreSQL |
| ORM | Spring Data JPA, Hibernate |
| HTTP Client | Axios |
| Routing | React Router |
| Charts | Chart.js, react-chartjs-2 |
| Icons | Lucide React |
| Build Tool | Maven, Vite |
| Deployment | Render |
| Database Hosting | Neon PostgreSQL |
| Version Control | Git, GitHub |

---

## Application Architecture

```text
                 USER
                  |
                  v
       React + Vite Frontend
                  |
                  | REST API Requests
                  | JWT Authentication
                  v
       Spring Boot Backend
                  |
          Spring Security
                  |
          Business Logic
                  |
          Spring Data JPA
                  |
                  v
          PostgreSQL Database
                  |
                  v
             Neon Cloud
```

### Deployment Architecture

- **Frontend:** Render Static Site
- **Backend:** Render Web Service
- **Database:** Neon PostgreSQL

---

## Project Structure

```text
financial-habit-builder/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── layouts/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── src/
│   └── main/
│       ├── java/
│       │   └── financial_habit_tracker/
│       │       ├── config/
│       │       ├── controller/
│       │       ├── service/
│       │       ├── repository/
│       │       ├── entity/
│       │       ├── dto/
│       │       └── ...
│       │
│       └── resources/
│           └── application.yml
│
├── pom.xml
├── Dockerfile
└── README.md
```

---

## Getting Started

Follow these steps to run WealthWise locally.

### Prerequisites

Make sure you have installed:

- Java 25
- Node.js and npm
- Maven
- PostgreSQL

### 1. Clone the Repository

```bash
git clone https://github.com/Sandeep8217/financial-habit-builder.git
```

```bash
cd financial-habit-builder
```

### 2. Backend Setup

Configure your backend environment variables using your IDE's environment configuration or a local `.env` file.

Required variables:

```env
DB_URL=jdbc:postgresql://localhost:5432/wealthwise_db
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password

JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRATION_MS=86400000
```

Make sure PostgreSQL is running and the database exists.

Run the backend:

```bash
mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

### 3. Frontend Setup

Open a separate terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Start the development server:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## Environment Variables

| Variable | Description |
|---|---|
| DB_URL | PostgreSQL JDBC connection URL |
| DB_USERNAME | Database username |
| DB_PASSWORD | Database password |
| JWT_SECRET | Secret used for JWT signing |
| JWT_EXPIRATION_MS | JWT expiration duration |
| VITE_API_BASE_URL | Backend API base URL |

**Security:** Never commit actual credentials, JWT secrets, or `.env` files to GitHub.

---

## Live Deployment

| Component | URL |
|---|---|
| WealthWise Frontend | https://wealthwise-frontend-ept5.onrender.com |
| WealthWise Backend | https://wealthwise-backend-ccfr.onrender.com |
| GitHub Repository | https://github.com/Sandeep8217/financial-habit-builder |

**Note:** The backend uses a free hosting tier, which may sleep after inactivity. The first request after inactivity can take longer to respond.

---

## Future Improvements

- CSV transaction import and export.
- PDF financial reports.
- Scheduled email reminders.
- Google authentication.
- More advanced financial analytics.
- Improved financial insights and recommendations.

---

## Author

**Sandeep Karne**

GitHub: [@Sandeep8217](https://github.com/Sandeep8217)

---

## License

This project is developed as a personal portfolio and learning project.

