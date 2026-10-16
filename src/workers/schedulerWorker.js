import {
  getDueScheduledNotificationsWithDetailsService,
  markScheduledNotificationAsSentService,
} from "../services/scheduledNotificationService.js";

import { publishNotification } from "../services/producerService.js";

export async function startSchedulerWorker() {
  console.log("Scheduler Worker Started");

  setInterval(async () => {
    try {
      const dueNotifications =
        await getDueScheduledNotificationsWithDetailsService();

      for (const notification of dueNotifications) {
        await publishNotification(notification);

        await markScheduledNotificationAsSentService(
          notification.scheduled_notification_id
        );

        console.log(
          `Scheduled Notification Queued: ${notification.id}`
        );
      }
    } catch (error) {
      console.error(
        "Scheduler Worker Error:",
        error.message
      );
    }
  }, 10000);
}
