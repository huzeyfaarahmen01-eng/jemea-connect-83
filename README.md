# Jemea Connect (83)

Jemea Website — Full-Stack React + Node.js + Tailwind Build Prompt

1. Project Overview

Build a complete, modern, production-ready full-stack web application called Jemea.

Jemea is a student idea submission, feedback, communication, and support platform. It provides a structured communication bridge between students and administration.

The platform must support two authenticated roles:

Student

Admin

It must also provide public pages for visitors.

Students should be able to submit ideas, questions, concerns, and feedback; track the status of their submissions; communicate with administrators through conversation threads; receive notifications; and manage their accounts.

Administrators should have a complete management dashboard where they can review submissions, search and filter records, update statuses, communicate with students, manage conversations, view analytics, inspect audit logs, manage their account, and create database backups.

The application must be responsive, modern, accessible, secure, and easy to maintain.

2. Required Technology Stack

Use the following stack. Do not replace it with Flask, Django, PHP, Laravel, or another backend framework.

Frontend

React

Vite

React Router

Tailwind CSS

JavaScript or TypeScript

Axios or Fetch API

Recharts for analytics

Lucide React or another modern icon library

Backend

Node.js

Express.js

REST API architecture

Database

Use:

SQLite for the initial implementation

Prisma ORM

The database architecture should be designed so that PostgreSQL can be introduced later without major application changes.

Authentication

Use secure server-side/session-based authentication.

Recommended implementation:

Express session

Secure HTTP-only cookies

Password hashing with Argon2 or bcrypt

Separate student/admin authorization

Session validation middleware

Email

Implement email support using:

Nodemailer

SMTP configuration through environment variables

Support both:

Development SMTP/MailHog

Production SMTP provider

Styling

Use:

Tailwind CSS

Responsive layouts

Modern dashboard components

Reusable UI components

Accessible forms

Consistent typography

Cards

Tables

Badges

Modals

Dropdowns

Toast/flash notifications

Loading states

Empty states

Error states

3. Architecture

Use a clean full-stack architecture.

Recommended structure:

jemea/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── config/
│   │   ├── db/
│   │   ├── email/
│   │   ├── backups/
│   │   ├── app.js
│   │   └── server.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── package.json
│
├── .env.example
├── README.md
└── package.json


Keep frontend and backend logically separated.

4. User Roles

Public Visitor

A visitor can:

View landing page

View About page

View Contact page

Submit a contact/idea/feedback form

Check submission status

Navigate to student login

Navigate to student registration

Visitors must not access authenticated student or admin resources.

5. Student Features

Students can:

Register

Log in

Log out

View dashboard

View their submissions

Track submission status

Open submission conversations

Send messages to admins

Receive notifications

View notification history

Mark notifications as read

Mark all notifications as read

Edit profile

Change password

Students must only be able to access their own data.

6. Admin Features

Administrators can:

Log in

Log out

View dashboard

Search submissions

Filter submissions

Paginate submissions

View submission details

Update submission status

Bulk-update submission statuses

Edit submission information

Reply to students by email

Send in-app messages

View conversation history

Delete selected conversation messages

Delete submissions

View analytics

View audit logs

Search audit logs

Filter audit logs

Manage admin credentials

Create database backups

View available backups

Admin functionality must be protected by role-based authorization.

7. Public Pages

Home Page

Create a polished modern landing page containing:

Jemea branding

Hero section

Clear headline

Short explanation

Primary call-to-action

Secondary call-to-action

Navigation

About link

Contact link

Login link

Student portal link

Responsive mobile navigation

The design should communicate trust, simplicity, education, communication, and accessibility.

About Page

Explain:

What Jemea is

Why it exists

How students use it

How administrators respond

How communication works

Use attractive cards or informational sections.

Contact Page

Create a form containing:

Name

Email

Department

Year

Message

Required fields must be validated.

On successful submission:

Create a submission record.

Set its status to NEW.

Display a success notification.

Clear/reset the form.

On failure:

Display a useful error message.

Never expose internal server/database errors.

Status Page

Allow students to check submission status.

The student can provide their email address.

Display the latest matching submission information.

Show:

Submission date

Status

Department

Year

Latest response if available

Do not expose private information belonging to unrelated students.

8. Student Authentication

Registration

Fields:

Full name

Email

Department

Year

Password

Confirm password

Requirements:

Validate all fields.

Validate email format.

Enforce unique email.

Enforce minimum password requirements.

Hash password before storage.

Never store plaintext passwords.

Display validation errors clearly.

Create student account.

Redirect to login after successful registration.

Student Login

Fields:

Email

Password

Requirements:

Validate credentials.

Create secure session.

Redirect to student dashboard.

Record successful login in audit logs.

Record failed attempts.

Apply rate limiting.

Prevent brute-force attacks.

9. Student Dashboard

Create a modern dashboard with:

Welcome section

Display:

Student name

Short welcome message

Statistics

Cards for:

Total submissions

New submissions

Read submissions

Replied submissions

Submission list

Each submission should display:

Subject/title or message preview

Status

Department

Date

Conversation indicator

View button

Recent activity

Show:

Recent notifications

Recent messages

Recent submission activity

10. Student Notifications

Create a notifications page.

Each notification contains:

Title

Message

Timestamp

Read/unread state

Actions:

Mark notification as read

Mark all as read

Clear notifications

Display unread count in the student navigation/header.

11. Student Conversation

Create a chat-style conversation page.

The page should contain:

Submission information

Conversation header

Chronological messages

Student messages

Admin messages

Message timestamps

Message input

Send button

Students can send replies.

Messages must be stored in the database.

Do not store conversation messages directly inside the main submission record.

Use the dedicated conversation table.

12. Student Profile

Allow students to edit:

Name

Department

Year

Do not allow students to directly modify protected account fields such as their internal user ID.

Record profile changes in the audit log.

13. Change Password

Require:

Current password

New password

Confirm new password

Validate:

Current password is correct

New password meets requirements

Confirmation matches

After successful password change:

Update password hash

Invalidate old sessions where appropriate

Require secure re-authentication if necessary

Record audit event

14. Admin Authentication

Create a dedicated admin login.

Fields:

Username

Password

Requirements:

Secure session

Rate limiting

Invalid-session detection

Secure password hashing

Authorization middleware

Audit logging

Students must never be able to access admin routes.

15. Admin Dashboard

Create a professional admin dashboard.

Include statistics:

Total messages

Total contacts

Today's messages

New

Read

Replied

Include:

Search

Status filter

Pagination

Recent submissions

Admin notifications

Recent activity

Backup management

The dashboard must be responsive.

16. Admin Submission Management

Create a submission management interface.

Columns can include:

ID

Student/name

Email

Department

Year

Status

Created date

Actions

Actions:

View

Edit

Reply

Conversation

Delete

Provide:

Search

Status filtering

Pagination

Bulk selection

Bulk status update

Bulk delete where appropriate

17. Submission Detail

The submission detail page must show:

Name

Email

Department

Year

Message

Current status

Created date

Reply information

Conversation status

If the submission status is initially NEW, opening the submission should update it to READ.

Create an audit log entry for this status transition.

18. Admin Reply

Create a reply page/modal.

Admin can:

Write a response

Send response through email

Store the reply in the database

Add a conversation message

Create a student notification

Change submission status to REPLIED

Email failures should be handled gracefully.

The system should not falsely report that an email was sent if SMTP delivery failed.

19. Admin Conversation

Create a full conversation interface.

Display:

Original submission

All conversation messages

Sender

Sender type

Timestamp

Admin can:

Send message

Delete selected messages

If all conversation messages have been removed:

conversation_cleared = true


The conversation should remain associated with the original submission.

20. Analytics

Create an analytics dashboard.

Include:

Summary statistics

Total submissions

New

Read

Replied

Total students

Total conversations

Charts

Create charts for:

Submissions by department

Submissions by year

Last 30 days activity

Monthly activity

Status distribution

Use Recharts.

Charts must be responsive.

Provide useful empty states when no data exists.

21. Audit Logs

Create an audit log page.

Log important events such as:

Student registration

Student login

Student logout

Admin login

Admin logout

Profile changes

Password changes

Submission creation

Submission edits

Submission deletion

Status changes

Replies

Conversation messages

Conversation deletions

Admin credential changes

Backup creation

Each audit record should contain:

ID

User type

User ID

Action

Details

IP address

Timestamp

Support:

Search

User-type filtering

Action filtering

Pagination

22. Admin Settings

Create an admin settings page.

Allow administrators to change:

Username

Password

Require the current password before sensitive changes.

After credential changes:

Invalidate existing session

Force re-login

Record audit event

23. Database Backup

Implement database backup functionality.

Admin should be able to:

Create a backup

View available backups

See backup timestamp

See backup filename

Restore a backup where safe and appropriate

Backups should not be publicly accessible.

Protect backup files from direct HTTP access.

24. Database Schema

Use Prisma.

Create at least the following models.

Student

id
name
email
password
department
year
createdAt
updatedAt


Message / Submission

id
name
email
message
createdAt
updatedAt
status
department
year
reply
conversationCleared
studentId


Statuses:

NEW
READ
REPLIED


ConversationMessage

id
submissionId
senderType
senderName
message
createdAt


submissionId must reference the submission.

Notification

id
studentId
submissionId
title
message
isRead
createdAt


AdminAccount

id
username
password
createdAt
updatedAt


AuditLog

id
userType
userId
action
details
ipAddress
createdAt


Use proper indexes and foreign keys.

Use cascading behavior carefully for deleted submissions.

25. API Design

Create a REST API.

Example structure:

/api/auth
/api/students
/api/submissions
/api/conversations
/api/notifications
/api/admin
/api/analytics
/api/audit-logs
/api/backups


Example endpoints:

POST   /api/auth/student/register
POST   /api/auth/student/login
POST   /api/auth/student/logout
GET    /api/auth/student/me

POST   /api/auth/admin/login
POST   /api/auth/admin/logout
GET    /api/auth/admin/me

POST   /api/submissions
GET    /api/submissions
GET    /api/submissions/:id
PATCH  /api/submissions/:id
DELETE /api/submissions/:id

GET    /api/submissions/:id/conversations
POST   /api/submissions/:id/conversations
DELETE /api/conversations/:id

GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all

GET    /api/admin/analytics
GET    /api/admin/audit-logs

POST   /api/admin/backups
GET    /api/admin/backups
POST   /api/admin/backups/:id/restore


Protect each endpoint with the appropriate authentication and authorization middleware.

26. Security Requirements

Security is a core requirement.

Implement:

Authentication

Secure password hashing

HTTP-only cookies

Secure session management

Session expiration

Session invalidation

Separate admin/student authorization

Authorization

Every protected endpoint must verify:

User is authenticated.

User has the required role.

Student owns the requested resource.

Never trust IDs supplied by the frontend.

CSRF

Protect state-changing requests against CSRF.

Use an appropriate CSRF strategy compatible with the session/cookie architecture.

Rate Limiting

Rate-limit:

Login

Registration

Password operations

Public submission endpoints

Other sensitive endpoints

Input Validation

Validate requests on the backend.

Use a validation library such as:

Zod


or

express-validator


Do not rely only on React/frontend validation.

SQL Injection

Use Prisma/parameterized database queries.

Never construct SQL queries using unsafe string concatenation.

XSS

Sanitize or safely render user-generated content.

Never inject user messages into HTML using unsafe mechanisms.

Error Handling

Create centralized Express error handling.

Users should receive safe errors such as:

{
  "success": false,
  "message": "Something went wrong."
}


Detailed errors must only be logged server-side.

27. Frontend Routing

Create protected React routes.

Example:

/
/about
/contact
/status

/student/register
/student/login
/student/dashboard
/student/notifications
/student/submissions/:id
/student/profile
/student/change-password

/admin/login
/admin/dashboard
/admin/submissions/:id
/admin/submissions/:id/edit
/admin/submissions/:id/reply
/admin/submissions/:id/conversation
/admin/analytics
/admin/audit-logs
/admin/settings


Unauthenticated users attempting to access protected pages should be redirected to the appropriate login page.

28. React Components

Create reusable components rather than duplicating UI.

Examples:

Button
Input
Textarea
Select
Modal
Dialog
Card
Badge
Table
Pagination
Dropdown
Toast
Alert
LoadingSpinner
EmptyState
ConfirmDialog
Navbar
Sidebar
DashboardCard
StatusBadge
NotificationItem
ConversationMessage


Use reusable layouts:

PublicLayout
StudentLayout
AdminLayout


29. Tailwind Design System

Create a consistent visual system using Tailwind.

The application should have:

Modern spacing

Rounded cards

Subtle borders

Clear hierarchy

Consistent typography

Responsive breakpoints

Accessible contrast

Smooth hover states

Focus states

Disabled states

Loading states

Do not make the UI overly complicated.

Prioritize:

clarity

usability

responsiveness

professional appearance

30. Responsive Design

The application must work well on:

Mobile phones

Tablets

Laptops

Desktop monitors

Admin tables should become mobile-friendly.

Navigation should collapse appropriately.

Cards should stack on small screens.

Conversation pages must remain usable on mobile.

31. Notifications

Create a reusable toast/flash message system.

Support:

Success

Error

Warning

Information

Examples:

Submission sent successfully.
Your profile has been updated.
Password changed successfully.
Invalid email or password.
You do not have permission to perform this action.
Message sent successfully.


32. Email System

Create a dedicated email service.

Example:

emailService.sendSubmissionReply()
emailService.sendNotification()


Environment variables:

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=


Do not hard-code credentials.

33. Environment Configuration

Create:

.env.example


Include:

NODE_ENV=development

PORT=5000

DATABASE_URL="file:./dev.db"

SESSION_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=

CLIENT_URL=http://localhost:5173


Never commit real secrets.

34. Development Experience

Provide:

npm install
npm run dev


The project should support starting frontend and backend conveniently.

Example root scripts:

{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\"",
    "build": "npm run build --prefix client",
    "start": "npm run start --prefix server"
  }
}


35. Seed Data

Create a database seed script.

The seed should create:

Demo admin account

Demo students

Demo submissions

Demo conversation messages

Demo notifications

Demo audit logs

Clearly document demo credentials in the README.

Never use insecure demo credentials in production.

36. Validation and Error States

Every form must have:

Client-side validation

Server-side validation

Required field indicators

Error messages

Loading state

Success state

Every API request should handle:

Network failure

Unauthorized response

Forbidden response

Validation error

Server error

Empty response

37. Empty States

Create attractive empty states.

Examples:

No submissions yet.
You don't have any notifications.
No conversations found.
No audit logs match your filters.
No analytics data is available.
No backups have been created.


38. Loading States

Use skeletons or loading indicators for:

Dashboard

Tables

Analytics

Conversations

Notifications

Profile

Submission details

Avoid blank screens while data is loading.

39. Confirmation Dialogs

Use confirmation dialogs before destructive actions.

Examples:

Delete submission?
Delete this conversation message?
Restore this database backup?
Change administrator credentials?


Never perform destructive operations accidentally from a single click.

40. Acceptance Criteria

The application is complete only when all of the following work:

Visitors can access the public pages.

Visitors can submit contact/idea messages.

Students can register.

Students can log in securely.

Students can log out.

Students can view their dashboard.

Students can view their submissions.

Students can track submission statuses.

Students can open conversations.

Students can send conversation messages.

Students receive notifications.

Students can mark notifications as read.

Students can edit profiles.

Students can change passwords.

Admins can log in securely.

Admins can access the dashboard.

Admins can search submissions.

Admins can filter submissions.

Admins can paginate submissions.

Admins can update statuses.

Admins can bulk-update statuses.

Admins can view submission details.

Admins can edit submissions.

Admins can reply by email.

Admins can send conversation messages.

Admins can delete conversation messages.

Admins can delete submissions.

Students receive notifications after relevant admin actions.

Analytics work.

Audit logs work.

Admin settings work.

Database backups work.

Authentication is secure.

Authorization prevents unauthorized access.

CSRF protection is implemented.

Rate limiting is implemented.

Passwords are securely hashed.

Input validation is implemented.

SQL injection is prevented.

Internal errors are not exposed.

Responsive design works across screen sizes.

The project can be installed and run locally using documented commands.

41. Development Phases

Phase 1 — Foundation

Build:

React/Vite frontend

Express backend

Tailwind

Prisma

SQLite

Environment configuration

Database schema

Seed system

Basic API architecture

Phase 2 — Authentication

Build:

Student registration

Student login

Student logout

Admin login

Admin logout

Sessions

Password hashing

Authorization middleware

Rate limiting

Phase 3 — Public Pages

Build:

Home

About

Contact

Status

Phase 4 — Student Portal

Build:

Dashboard

Submission history

Conversation

Notifications

Profile

Password change

Phase 5 — Admin Portal

Build:

Admin dashboard

Submission management

Search

Filters

Pagination

Status management

Editing

Replies

Conversations

Deletion

Phase 6 — Communication

Build:

Email service

SMTP

In-app messages

Notifications

Conversation persistence

Phase 7 — Analytics and Audit

Build:

Analytics

Charts

Audit logs

Filters

Pagination

Phase 8 — Backup

Build:

Backup creation

Backup listing

Restore functionality

Admin access controls

Phase 9 — Security

Perform a full security review covering:

Authentication

Authorization

Sessions

CSRF

Rate limiting

XSS

SQL injection

Validation

Error handling

Sensitive data exposure

Phase 10 — QA

Test:

Public flows

Student flows

Admin flows

Authentication

Permissions

Notifications

Conversations

Email

Analytics

Backups

Mobile responsiveness

42. UI/UX Requirements

The website should feel like a modern SaaS/student platform rather than an old-fashioned CRUD application.

Use:

Clean sidebar navigation

Professional dashboard cards

Modern data tables

Responsive modals

Clear status badges

Good whitespace

Strong typography

Consistent icons

Smooth transitions

Accessible interactions

Use Tailwind throughout the application.

Avoid:

Excessive gradients

Excessive animations

Cluttered dashboards

Tiny text

Poor contrast

Unnecessary UI elements

43. Production Requirements

The final project must be structured for future production deployment.

Include:

Environment configuration

Secure cookies

CORS configuration

Logging

Centralized error handling

Database migrations

Database seed

Backup support

Security middleware

Rate limiting

Input validation

API authorization

Clean frontend/backend separation

The frontend should be deployable independently from the Node.js API.

44. Final Deliverables

Provide the complete project including:

React frontend

Tailwind CSS

Node.js backend

Express API

Prisma schema

SQLite database setup

Authentication

Student portal

Admin dashboard

Conversations

Notifications

Email system

Analytics

Audit logs

Backup system

Validation

Security middleware

Seed data

Environment configuration

README

Installation instructions

Development instructions

Production deployment instructions

Do not provide only mockups or static HTML.

All major buttons, forms, tables, filters, authentication flows, API calls, database operations, conversations, notifications, analytics, and admin functions must actually work.

The final result should be a fully functional full-stack Jemea application, not merely a visual prototype.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9ae5e7b3-aefc-416a-9ebf-6274ef3a31d3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? Install Bun from [bun.sh](https://bun.sh/).

```sh
git clone <this-repository-url>
cd <repository-name>
bun install
bun run dev
```

## Firebase Setup

This app uses Firebase Authentication and Cloud Firestore. Before testing account creation or submissions:

1. In the Firebase console for `jemeawebsite`, enable Email/Password and Google under Authentication, add your website domain to Authorized domains, and create the default Firestore database.
2. To grant an administrator, find the person's Firebase Authentication UID, then create `/admins/{UID}` in Firestore with `{ "enabled": true }`. Only project owners can write this collection; sign out and back in after granting access.
3. Deploy the repository's Firestore rules and index with the Firebase CLI:

  ```sh
  bunx firebase-tools login
  bunx firebase-tools deploy --only firestore:rules,firestore:indexes
  ```

4. The supplied web configuration is in the ignored `.env.local` file. Set the same `VITE_FIREBASE_*` variables in the production hosting environment before building.

The Firebase web API key is public app configuration, not an admin credential. Never put a service-account key in client code or commit it.
