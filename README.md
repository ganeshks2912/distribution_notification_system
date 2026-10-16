Distributed Notification Delivery System

A backend notification platform built with Node.js, Express.js, PostgreSQL, RabbitMQ, and Docker. The system supports asynchronous notification processing, scheduled delivery, retry handling, dead-letter queues, idempotency, audit logging, and user notification preferences.

🚀 Features

1. Multi-Channel Notifications

- Supports Email and SMS notification channels at the application level.
- Stores recipient details, message content, channel, priority, and delivery status.
- Applies channel-specific notification preferences.
- Real email and SMS provider integrations are not yet implemented.

2. Asynchronous Processing with RabbitMQ

- Decouples API requests from notification processing.
- Publishes notification messages to a durable RabbitMQ queue.
- Processes messages using a dedicated notification worker.
- Uses message acknowledgments to manage queue processing.

3. Retry Mechanism

- Automatically retries failed notification processing.
- Tracks retry attempts using PostgreSQL.
- Supports configurable maximum retry counts.
- Marks notifications as failed after the retry limit is reached.

4. Dead Letter Queue (DLQ)

- Routes notifications to a separate dead-letter queue after retries are exhausted.
- Retains failed messages for inspection and troubleshooting.

5. Scheduled Notifications

- Schedules notifications for future delivery.
- Stores scheduling information in a separate PostgreSQL table.
- Uses a scheduler worker to identify due notifications.
- Publishes due notifications to RabbitMQ for asynchronous processing.

6. Idempotency

- Uses idempotency keys to prevent duplicate notification creation for repeated requests with the same key.
- Helps make client retries safer.

7. Notification Preferences

- Supports recipient-specific Email and SMS preferences.
- Skips notifications when the corresponding channel is disabled.
- Provides APIs to retrieve and update notification preferences.

8. Delivery Status Tracking

Tracks notification processing using statuses such as:

- "QUEUED"
- "PROCESSING"
- "DELIVERED"
- "FAILED"
- "SKIPPED"

Scheduled notifications separately track scheduling status, including "PENDING" and "SENT_TO_QUEUE".

9. Audit Logging

- Records notification-related events.
- Stores event details for traceability and troubleshooting.

---

🛠️ Technology Stack

Technology| Purpose
Node.js| JavaScript runtime
Express.js| REST API framework
PostgreSQL| Persistent data storage
RabbitMQ| Asynchronous message broker
Docker| Running RabbitMQ in a container
JavaScript ES Modules| Application module system
Postman| API testing

---

🏗️ Architecture

                    Client / Postman
                           |
                           v
                    Express REST API
                           |
                           v
                      PostgreSQL
                           |
                 +---------+---------+
                 |                   |
          Immediate Request     Scheduled Request
                 |                   |
                 v                   v
          RabbitMQ Producer    Scheduled Notifications
                 |                   |
                 v                   v
        notification_queue     Scheduler Worker
                 |                   |
                 |<------------------+
                 v
        Notification Worker
                 |
          Check Preferences
                 |
          +------+------+ 
          |      |      |
          v      v      v
       DELIVERED SKIPPED Retry / DLQ

Core design principle: PostgreSQL stores notification and scheduling state, while RabbitMQ decouples notification creation from background processing.

📁 Project Structure

distributed-notification-system/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── rabbitmq.js
│   ├── controllers/
│   │   ├── notificationController.js
│   │   └── notificationPreferenceController.js
│   ├── middlewares/
│   │   └── validateNotification.js
│   ├── repositories/
│   │   ├── notificationRepository.js
│   │   ├── scheduledNotificationRepository.js
│   │   ├── notificationPreferenceRepository.js
│   │   └── auditLogRepository.js
│   ├── routes/
│   │   ├── notificationRoutes.js
│   │   └── notificationPreferenceRoutes.js
│   ├── services/
│   │   ├── notificationService.js
│   │   ├── scheduledNotificationService.js
│   │   ├── notificationPreferenceService.js
│   │   ├── auditLogService.js
│   │   └── producerService.js
│   ├── workers/
│   │   ├── notificationWorker.js
│   │   └── schedulerWorker.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md

The tree shows the main files and may need adjustment to match the current repository.

---

⚙️ Prerequisites

Install the following before running the project:

- "Node.js" (https://nodejs.org/)
- "PostgreSQL" (https://www.postgresql.org/)
- "Docker Desktop" (https://www.docker.com/products/docker-desktop/)
- "Postman" (https://www.postman.com/) (optional, for testing)

🔧 Installation and Setup

1. Clone the Repository

git clone 
cd distributed-notification-system

2. Install Dependencies

npm install

3. Configure Environment Variables

Create a ".env" file in the project root.

Example:

PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/notification_db

Use the database configuration expected by your "src/config/db.js". If it uses separate PostgreSQL variables instead of "DATABASE_URL", configure those variables accordingly.

Important: Never commit your real ".env" file, passwords, or credentials. Keep ".env.example" free of secrets.

4. Configure PostgreSQL

Create the project database:

CREATE DATABASE notification_db;

Run your project's SQL schema or migration files to create the required tables, including:

- "notifications"
- "scheduled_notifications"
- "notification_preferences"
- "audit_logs"

Ensure all other tables required by the application are created before starting the server.

5. Start RabbitMQ with Docker

Make sure Docker Desktop is running, then execute:

docker run -d \
  --hostname rabbitmq \
  --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management

If the container already exists, start it instead:

docker start rabbitmq

Verify that it is running:

docker ps

RabbitMQ management interface:

http://localhost:15672

The default credentials for the standard RabbitMQ management image are "guest" / "guest" for local access. Change credentials before exposing RabbitMQ beyond your development machine.

6. Start the Application

npm run dev

The application should connect to PostgreSQL and RabbitMQ, then start the notification and scheduler workers.

Expected startup logs:

Database Connected Successfully
RabbitMQ Connected Successfully
Notification Worker Started
Scheduler Worker Started
Server running on port 5000

The exact output may differ depending on your logging configuration.

---

🔌 API Endpoints

The following endpoints are implemented in the current application.

Notifications

Method| Endpoint| Description
"POST"| "/notifications"| Create and queue a notification or schedule it for later
"GET"| "/notifications"| Retrieve all notifications
"GET"| "/notifications/:id"| Retrieve a notification by ID

Notification Preferences

Method| Endpoint| Description
"GET"| "/preferences/:recipientId"| Retrieve a recipient's preferences
"PUT"| "/preferences/:recipientId"| Update a recipient's preferences

Example: Create a Notification

"POST /notifications"

{
  "recipientId": "user123",
  "channel": "EMAIL",
  "subject": "Welcome",
  "content": "Welcome to our platform!",
  "priority": "HIGH"
}

The exact required fields depend on the validation middleware. Use the correct request format configured in the application.

Example: Schedule a Notification

"POST /notifications"

{
  "recipientId": "user123",
  "channel": "EMAIL",
  "content": "Meeting reminder",
  "priority": "HIGH",
  "scheduledFor": "2026-12-01T10:00:00"
}

Use a future timestamp when testing scheduled delivery. The timestamp should be interpreted consistently with the server and database timezone configuration.

Example: Update Preferences

"PUT /preferences/user123"

{
  "emailEnabled": true,
  "smsEnabled": false,
  "marketingEnabled": false
}

The system checks the recipient's preferences before simulated delivery. A disabled channel results in the notification being marked "SKIPPED".

---

🧪 Testing

Use Postman to test the API endpoints and your PostgreSQL client to verify database state.

Recommended test cases:

1. Create a notification and retrieve it by ID.
2. Retrieve all notifications.
3. Submit invalid input and verify validation errors.
4. Repeat a request with the same idempotency key and verify duplicate prevention.
5. Create a notification and verify asynchronous worker processing.
6. Simulate a delivery failure and verify retry handling.
7. Exhaust retries and verify that the message reaches the DLQ.
8. Schedule a notification and verify that it is queued when due.
9. Disable Email or SMS preferences and verify that delivery is skipped.
10. Update preferences through the API and verify the updated database values.

Remove any simulated failure code before normal testing.

🔒 Reliability and Design Considerations

- Durable RabbitMQ queues and persistent messages help protect queued work.
- Manual acknowledgments control when messages are removed from the queue.
- PostgreSQL stores notification status and retry counts.
- Idempotency reduces duplicate notification creation.
- The scheduler checks for due notifications periodically.
- Retry and dead-letter handling make failures easier to manage.

For production use, further hardening is needed around atomic scheduling and queue publication, concurrent scheduler execution, duplicate message processing, retry backoff, provider timeouts, and monitoring.

🚧 Future Enhancements

Planned improvements include:

- Real Email and SMS provider integrations
- Notification template management and variable rendering
- Priority-based message processing
- Redis-based rate limiting and caching
- Bulk notification processing
- Analytics and delivery metrics
- DLQ management APIs
- Horizontal worker scaling
- Health checks and monitoring
- Docker Compose for the full stack
- Webhooks and a real-time dashboard

🎯 Project Objective

The goal of this project is to demonstrate practical backend engineering and distributed-systems concepts through asynchronous processing, persistent state management, retry handling, scheduled jobs, idempotency, and preference-aware notification workflows.

👨‍💻 Author
Ganesh K S
