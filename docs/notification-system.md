# Notification System

Notification engine components:

- NotificationRepository
- NotificationService
- NotificationDispatcher
- Notifications BullMQ queue
- Email BullMQ queue
- Realtime notification channel

Types:

- info
- success
- warning
- critical

Channels:

- in-app
- email
- realtime

Creating a notification persists the notification, dispatches in-app/realtime delivery, and publishes `notification.created` through the event bus.
