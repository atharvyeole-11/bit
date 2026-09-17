# Elderly Care & Companion Support Platform - Backend

This is the Node.js + Express.js backend for the Elderly Care Platform.

## Setup Instructions

1. Run `npm install` to install all dependencies.
2. Copy `.env.example` to `.env` and fill in your actual credentials (MongoDB URI, JWT Secret, Twilio, etc.).
3. Start the server using `npm start` or `node index.js`.

## API Documentation

All routes require a valid JWT passed in the `Authorization: Bearer <token>` header, unless specified otherwise.

### Core Routes

#### `GET /api/health`
- Health check endpoint to verify server is running.

#### `GET /api/user/languages`
- Get list of supported languages.

#### `PUT /api/user/language`
- Update user language preference. 
- **Body**: `{ "language": "es" }`

#### `PUT /api/user/accessibility`
- Update user accessibility mode.
- **Body**: `{ "accessibilityMode": true }`

---

### Kit 1 — Voice & Ease Kit

#### `POST /api/voice/transcribe`
- Parse voice intent from text/audio.
- **Body**: `{ "text": "remind me to take pills", "audioData": "..." }`

#### `GET /api/knowledge-base`
- Get all knowledge base entries.

#### `POST /api/knowledge-base`
- Create a knowledge base entry. (Admin/Caregiver)
- **Body**: `{ "title": "...", "content": "...", "category": "..." }`

#### `DELETE /api/knowledge-base/:id`
- Delete an entry.

#### `GET /api/reminders`
- Get all reminders for the authenticated user.

#### `POST /api/reminders`
- Create a reminder.
- **Body**: `{ "type": "medication", "datetime": "2023-10-01T10:00:00Z", "recurrence": "daily", "message": "Take pills" }`

#### `PUT /api/reminders/:id`
- Update reminder.

#### `DELETE /api/reminders/:id`
- Delete reminder.

---

### Kit 2 — Credibility Score Module

#### `POST /api/feedback`
- Submit feedback and rating for a caregiver. Triggers score recalculation.
- **Body**: `{ "caregiverId": "<id>", "rating": 5, "comment": "Great!" }`

#### `GET /api/credibility/:caregiverId`
- Get credibility score of a caregiver.

---

### Kit 3 — Queue & Wait Kit

#### `POST /api/queue/join`
- Join a service queue.
- **Body**: `{ "serviceId": "doctor_consult" }`

#### `GET /api/queue/:serviceId/status`
- Get current status of the queue and your position if joined.

#### Socket.io Namespace: `/queue`
- Connect to `/queue` for live updates.
- Events: `queue_update` => `{ serviceId, peopleWaiting }`

---

### Kit 4 — Guardian Watch Kit

#### `POST /api/emergency/trigger`
- Trigger an emergency relay immediately to all linked guardians.
- **Body**: `{ "geolocation": { "lat": 40.7128, "lng": -74.0060 } }`

#### `GET /api/activity-log/:userId`
- Get paginated activity logs for a user. (Admin/Caregiver/Guardian)
- **Query Params**: `type`, `startDate`, `endDate`, `page`, `limit`
