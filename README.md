# SBS Student Serving System

A comprehensive student management system developed for Saigon Business School (SBS) that provides a centralized platform for students, faculty, and administrators to manage academic activities, personal information, and institutional communications.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

The SBS Student Serving System is a full-stack web application designed to streamline student services at Saigon Business School. It offers separate interfaces for students, lecturers, and administrators with role-based access control to ensure data security and appropriate permissions.

## Features

### For Students
- Change password
- Upload certificates
- Change profile picture
- View services only

### For Administrators
- Full CRUD operations on all entities
- Complete access to all system functionalities

## Technology Stack

### Backend
- **Java 21**: Primary programming language
- **Spring Boot 3.5.3**: Framework for building the RESTful API
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Database access and management
- **MySQL**: Primary relational database
- **JWT**: Token-based authentication
- **Maven**: Dependency management and build automation

### Frontend
- **React 18**: JavaScript library for building user interfaces
- **Vite**: Next generation frontend tooling
- **TailwindCSS**: Utility-first CSS framework
- **React Router**: Declarative routing for React
- **Axios**: Promise based HTTP client
- **FontAwesome**: Icon toolkit

## Architecture

The application follows a client-server architecture with a clear separation between frontend and backend:

```
┌─────────────────┐    HTTP    ┌──────────────────┐
│   Frontend      │───────────▶│    Backend       │
│   (React/Vite)  │            │ (Spring Boot)    │
└─────────────────┘            └──────────────────┘
                                        │
                                ┌───────▼──────────┐
                                │  MySQL Database  │
                                └──────────────────┘
```

The backend exposes a RESTful API that the frontend consumes to display data and handle user interactions.

## Project Structure

```
SBS_StudentServing_System/
├── front-end/                 # React frontend application
│   ├── src/
│   │   ├── Components/        # Reusable UI components
│   │   ├── Pages/             # Page components
│   │   ├── Routes/            # Application routing
│   │   ├── api/               # API service configuration
│   │   └── utils/             # Utility functions and context providers
│   └── ...
├── src/                       # Spring Boot backend application
│   ├── main/
│   │   ├── java/
│   │   │   └── com/SBS_StudentServing_System/
│   │   │       ├── config/    # Security and application configuration
│   │   │       ├── controller/# REST API controllers
│   │   │       ├── dto/       # Data transfer objects
│   │   │       ├── exception/ # Exception handling
│   │   │       ├── mapping/   # Entity-DTO mappers
│   │   │       ├── model/     # JPA entities
│   │   │       ├── repository/# Database repositories
│   │   │       └── service/   # Business logic services
│   │   └── resources/         # Configuration files
│   └── test/                  # Unit and integration tests
├── uploads/                   # File upload directory
└── ...
```

## Getting Started

### Prerequisites

- Java 21 or higher
- MySQL 8.0 or higher
- Node.js 16 or higher
- npm 8 or higher
- Maven 3.8 or higher

### Backend Setup

1. Configure database connection in `src/main/resources/application.properties`:
   ```
   spring.datasource.url=jdbc:mysql://localhost:3306/sbs_student_system
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

2. Build and run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   Or build and run the JAR file:
   ```bash
   ./mvnw clean package
   java -jar target/SBS_StudentServing_System-0.0.1-SNAPSHOT.jar
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd front-end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Usage

After starting both the backend and frontend servers:

1. Open your browser and navigate to `http://localhost:5173` (default Vite port)
2. Login with your credentials or access as a guest
3. Navigate through the dashboard to access various features based on your role

## API Documentation

The backend exposes a RESTful API with endpoints organized by functionality:

- Authentication: `/api/auth/**`
- Announcements: `/api/announcements/**`
- Students: `/api/students/**`
- Courses: `/api/courses/**`
- Grades: `/api/grades/**`
- Attendance: `/api/attendance/**`

Detailed API documentation is available through the application's Swagger UI when the backend is running.

## Database Schema

The application uses a relational database with tables for:
- Users and roles
- Students and academic records
- Courses and enrollments
- Departments and programs
- Attendance records
- Grades and transcripts
- Visa and passport documents
- Announcements and news

## Deployment

### Backend Deployment

1. Package the application:
   ```bash
   ./mvnw clean package -Pprod
   ```

2. Deploy the generated JAR file to your server

3. Set environment variables for production:
   ```bash
   export SPRING_PROFILES_ACTIVE=prod
   ```

### Frontend Deployment

1. Build the production version:
   ```bash
   cd front-end
   npm run build
   ```

2. Deploy the contents of the `dist/` folder to your web server

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is proprietary software developed for Saigon Business School. All rights reserved.