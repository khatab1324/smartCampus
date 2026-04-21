# Smart Campus System

## 1. Overview

Smart Campus is a mobile-first attendance system designed to replace manual attendance tracking with a digital, real-time, and intelligent solution.

The system allows:
- students to check in to lectures
- instructors to manage attendance sessions
- real-time monitoring of attendance
- automatic classification of attendance (present, late, absent)

The system improves transparency, accuracy, and usability in university environments.

---

## 2. Tech Stack

### Monorepo
- Turborepo
- npm workspaces

### Backend
- Express.js (TypeScript)
- Firebase Admin SDK
- Firestore (database)
- Firebase Auth + Firebase ID token verification

### Mobile App
- React Native (Expo)
- Firebase Client SDK (for auth and real-time updates)

### Shared
- Types package
- Validation package (Zod)

---

## 3. System Architecture

The system follows a layered architecture:

Client → API → Firebase

### Backend Flow
Route → Controller → Use Case → Repository → Firestore

### Layers

#### Client Layer (Mobile)
- UI screens
- API service layer (Axios)
- Firebase listeners for real-time updates

#### Backend Layer (Express)
- Middleware (auth, validation, errors)
- Use-case layer (business logic)
- Repository layer (data access)

#### Cloud Layer (Firebase)
- Firestore database
- Firebase Admin SDK

---

## 4. User Roles

### Student
- join attendance sessions
- view attendance history
- view lecture attendance status

### Instructor
- create lectures
- create attendance sessions
- activate/close sessions
- monitor attendance
- filter students (late / absent)
- view logs and student profiles

---

## 5. Core Features

### Authentication
- student registration via Firebase Auth email/password
- instructor registration via Firebase Auth email/password
- Firebase verification email before full access
- backend verifies Firebase ID tokens for protected routes
- role-based access

### Lecture Management
Instructor can:
- create lecture
- update lecture
- delete lecture
- view lectures

### Attendance Session Management
Instructor can:
- create session
- activate session
- define time window
- close session

### Attendance Registration
Student can:
- join active session
- attendance is recorded with timestamp
- attendance is linked to lecture/session

### Attendance Status
System classifies:
- present
- late
- absent

### Monitoring
Instructor can:
- view attendance logs
- view timestamps
- filter late students
- filter absent students

Student can:
- view personal attendance history

### Real-Time Updates
- Firestore pushes updates instantly
- mobile UI updates automatically

---

## 6. Core Entities (Firestore)

### users
