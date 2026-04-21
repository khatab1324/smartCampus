# Smart Campus Steering File

## Project Identity

Smart Campus is a mobile-first attendance system for university environments.

The app has two primary roles:

- Student
- Instructor

Core domain goals:

- automate attendance registration
- allow instructors to create and control attendance sessions
- allow students to join active attendance sessions
- record exact attendance timestamps
- classify attendance as `present`, `late`, or `absent`
- support real-time attendance monitoring
- keep the system simple, maintainable, and scalable

## Tech Stack

- Monorepo: Turborepo
- Package manager: npm
- Mobile app: React Native with Expo
- Backend API: Express.js with TypeScript
- Authentication: Firebase Auth with email verification
- Database: Cloud Firestore
- Shared code: workspace packages for types and validation

## Architecture Rules

The project must follow a simple layered structure.

Preferred backend flow:
Route -> Controller -> Use Case -> Repository -> Firebase

### Backend folders

- `routes/` for route declarations only
- `controllers/` for HTTP request/response handling only
- `use-cases/` for business actions and domain behavior
- `repositories/` for Firestore access only
- `middleware/` for auth, validation, and error handling
- `config/` for environment and Firebase setup
- `types/` for backend-only typing when needed

### Frontend folders

- `app/` or `src/` for screens and navigation
- `features/` for domain slices like auth, attendance, lectures
- `components/` for reusable UI
- `services/` for API calls
- `hooks/` for reusable logic hooks
- `store/` only if state management becomes necessary
- `constants/` for shared static values

## Design Philosophy

Keep the codebase:

- explicit
- readable
- boring in a good way
- easy to change
- easy to debug

Avoid architecture theater.
Do not introduce heavy abstractions unless there is a real need.

## Naming Rules

Use names that describe business intent.

Prefer:

- `join-session.use-case.ts`
- `activate-attendance-session.use-case.ts`
- `get-student-attendance-history.use-case.ts`

Avoid vague names like:

- `attendance.service.ts`
- `helper.ts`
- `manager.ts`
- `stuff.ts`

## AI Behavior Rules

When AI contributes code, it must follow these rules:

1. Do not invent architecture not requested by the project.
2. Do not switch to NestJS-like module architecture.
3. Do not introduce classes unless they provide real value.
4. Prefer functions over classes for controllers, use-cases, and repositories.
5. Keep each use-case focused on one business action.
6. Keep controllers thin.
7. Keep repositories dumb: database access only.
8. Validation must happen before business logic runs.
9. Authentication and authorization must be explicit.
10. Do not mix Firebase code into controllers.
11. Do not mix HTTP concerns into repositories.
12. Do not duplicate types across mobile and backend if they can be shared.
13. Favor small, composable functions over giant files.
14. Avoid premature optimization.
15. Do not generate placeholder code that looks complete but does nothing.

## Domain Rules

The AI must respect these domain concepts:

### Roles

- `student`
- `instructor`

### Attendance statuses

- `present`
- `late`
- `absent`

### Attendance session behavior

- an instructor can create and activate an attendance session
- an instructor can define an attendance time window
- a student can only join an active valid session
- the system must store the exact timestamp of student check-in
- duplicate attendance must be prevented
- closed sessions must reject new attendance attempts
- late check-in must be identified based on session rules

### Monitoring behavior

- instructors can see attendance logs per lecture
- instructors can filter late and absent students
- students can view their own attendance history
- the system should support real-time updates

## API Rules

- RESTful routes where practical
- predictable response shapes
- meaningful HTTP status codes
- clear error messages
- never return raw Firebase internals
- auth-protected routes must require a verified Firebase ID token

## Validation Rules

Validation should be centralized and reusable.

Prefer:

- shared zod schemas in workspace packages

Validation must cover:

- request body shape
- required IDs
- role-sensitive actions
- session join conditions
- date/time inputs where relevant

## Firebase Rules

- Firebase Admin SDK must only live in backend
- Firebase Auth should handle signup, signin, and email verification
- mobile app must never use admin credentials
- Firestore collection names must be consistent
- document shape should be explicit and typed
- security assumptions must not rely only on the client

## Data Modeling Guidance

Expected core collections:

- `users`
- `lectures`
- `attendanceSessions`
- `attendanceRecords`

Each model must have clear ownership and timestamps where needed.

## Quality Rules

AI must:

- write code that compiles
- avoid fake imports
- avoid hand-wavy pseudo-implementation unless explicitly asked
- keep files cohesive
- add comments only where they genuinely help
- keep business rules discoverable in use-case files

## Testing Rules

When adding tests:

- test behavior, not implementation trivia
- prefer integration-style tests for core flows
- cover critical business cases first
- include edge cases like:
  - duplicate attendance
  - expired session
  - invalid token
  - instructor closes session early
  - network or retry-related failure paths when relevant

## Forbidden Moves

The AI must not:

- add a heavy module system
- add Redux before there is actual state complexity
- add ORM-like abstractions over Firestore without need
- create giant generic base classes
- hide business logic in utility files
- place all logic inside routes
- place all logic inside controllers
- generate inconsistent naming across files

## Output Expectations for AI

When AI creates code, it should:

- state what file it is creating
- keep folder placement aligned with this steering file
- preserve existing conventions
- avoid changing architecture unless explicitly requested
- prefer incremental delivery over massive rewrites

## Guiding Principle

Build the smallest clean version that supports:

- authentication
- role-based access
- attendance session lifecycle
- student check-in
- attendance history
- instructor monitoring

Then expand carefully.
