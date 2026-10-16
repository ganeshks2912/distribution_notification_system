// Notification service
import {
  createNotification,
  findNotificationById,
  getAllNotifications,
  findNotificationByIdempotencyKey,
  updateNotificationStatus,
  incrementRetryCount,
} from "../repositories/notificationRepository.js";


import { publishNotification } from "./producerService.js";

import { createAuditLogService } from "./auditLogService.js";

import {
  createScheduledNotificationService,
} from "./scheduledNotificationService.js";

export const createNotificationService = async (
  notificationData
) => {
  if (notificationData.idempotencyKey) {
    const existingNotification =
      await findNotificationByIdempotencyKey(
        notificationData.idempotencyKey
      );

    if (existingNotification) {
      return existingNotification;
    }
  } 

  const notification = await createNotification(
    notificationData
  );

  await createAuditLogService(
    notification.id,
    "NOTIFICATION_CREATED",
    {
      channel: notification.channel,
      priority: notification.priority,
    }
  );

  if (notificationData.scheduledFor) {
  await createScheduledNotificationService(
    notification.id,
    notificationData.scheduledFor
  );

  console.log(
    `Notification Scheduled: ${notification.id}`
  );
} else {
  await publishNotification(notification);

}

return notification;
};

export async function getNotificationByIdService(id) {
  return await findNotificationById(id);
}

export async function getAllNotificationsService() {
  return await getAllNotifications();
}

export async function updateNotificationStatusService(
  notificationId,
  status
) {
  return await updateNotificationStatus(
    notificationId,
    status
  );
}

export async function incrementRetryCountService(
  notificationId
) {
  return await incrementRetryCount(
    notificationId
  );
}
