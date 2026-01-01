# Multi-Tenant SaaS Platform – Project & Task Management System

## Project Description

This project is a **production-ready Multi-Tenant SaaS application** that allows multiple organizations (tenants) to independently manage their users, projects, and tasks with complete data isolation.  
It is designed for **startups, enterprises, and SaaS product teams** that require secure multi-tenant architecture with role-based access control and subscription management.

---

## Key Features

- Multi-tenant architecture with strict data isolation
- Subdomain-based tenant identification
- JWT-based authentication with 24-hour expiry
- Role-Based Access Control (Super Admin, Tenant Admin, User)
- Tenant subscription plans with enforced limits
- Project and task management per tenant
- User management within tenants
- Audit logging for critical actions
- Secure password hashing using bcrypt
- Fully dockerized deployment with one-command startup
- Automatic database migrations and seed data
- Health check endpoint for system monitoring
- Responsive frontend with role-based UI rendering

---

## Quick Start

```bash
# Clone & Run (All services)
git clone <repo>
cd project
docker-compose up -d

# Access:
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000/api
# Database: localhost:5432
```

##  Test Credentials

| Role         | Email                   | Password   | Tenant |
| ------------ | ----------------------- | ---------- | ------ |
| Super Admin  | `superadmin@system.com` | `Admin123` | None   |
| Tenant Admin | `admin@demo.com`        | `Demo123`  | `demo` |
| User         | `user1@demo.com`        | `User123`  | `demo` |

##  Project Structure

```text
├── backend/          # Node.js + Express API
├── frontend/         # React SPA
├── database/         # Migrations + Seeds
├── docs/             # API, Architecture, ERD
└── docker-compose.yml
```

##  Services

| Service  | Port    | Status                                                                 |
| -------- | ------- | ---------------------------------------------------------------------- |
| Frontend | `:3000` |  [http://localhost:3000](http://localhost:3000)                       |
| Backend  | `:5000` |  [http://localhost:5000/api/health](http://localhost:5000/api/health) |
| Database | `:5432` |  PostgreSQL (saasdb)   

## Demo Video : 

    https://drive.google.com/file/d/1NAmMGV83_8jjIghB_ERCGBP0GP8DvpEa/view?usp=sharing

---

## Technology Stack

### Frontend
- React.js (v18)
- React Router DOM
- Axios
- Context API
- CSS (Custom styling)

### Backend
- Node.js (v18)
- Express.js
- JWT (jsonwebtoken)
- bcrypt
- Knex.js (Query Builder)

### Database
- PostgreSQL (v15)

### DevOps & Containerization
- Docker
- Docker Compose

---

## Architecture Overview

The system follows a **three-tier architecture**:

1. **Frontend (React)**  
   Handles user interface, authentication flow, and API interactions.

2. **Backend (Express API)**  
   Manages business logic, authentication, authorization, tenant isolation, and database access.

3. **Database (PostgreSQL)**  
   Stores tenant, user, project, task, and audit log data with strict foreign key constraints.

**Architecture Diagram**

* [System Architecture](docs/images/system-architecture.png)
* [Database ERD](docs/images/database-erd.png)

---

## Installation & Setup

### Prerequisites

Ensure the following are installed:

- Node.js (v18 or higher)
- npm
- Docker
- Docker Compose
- Git

---

### Local Setup (Docker – Recommended)

##  Docker Commands

```bash
docker-compose up -d          # Start all
docker-compose down           # Stop
docker-compose logs backend   # View logs
docker exec -it backend sh    # Shell access
```

## Automatic Startup Behavior

When running the application using Docker Compose, the following steps occur automatically:

- Start PostgreSQL database
- Run database migrations
- Load seed data
- Start backend API server
- Start frontend application

---

##  Documentation

| File                   | Description            |
| ---------------------- | ---------------------- |
| `docs/API.md`          | 22 APIs with examples  |
| `docs/architecture.md` | System design + ERD    |
| `docs/PRD.md`          | Product requirements   |
| `submission.json`      | Evaluation credentials |

## Health Check

Verify backend readiness using the health check endpoint:

curl http://localhost:5000/api/health
