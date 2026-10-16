import {
  getDueScheduledNotificationsWithDetails,
  markScheduledNotificationAsSent,
  createScheduledNotification,
} from "../repositories/scheduledNotificationRepository.js";


export async function getDueScheduledNotificationsWithDetailsService() {
  return await getDueScheduledNotificationsWithDetails();
}

export async function markScheduledNotificationAsSentService(
  scheduledNotificationId
) {
  return await markScheduledNotificationAsSent(
    scheduledNotificationId
  );
}

export async function createScheduledNotificationService(
  notificationId,
  scheduledFor
) {
  return await createScheduledNotification(
    notificationId,
    scheduledFor
  );
}

