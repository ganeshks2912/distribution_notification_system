// RabbitMQ consumer worker
import {
  getChannel,
  NOTIFICATION_QUEUE,
  DEAD_LETTER_QUEUE,
} from "../config/rabbitmq.js";
import {
  updateNotificationStatusService,
  incrementRetryCountService,
} from "../services/notificationService.js";

import {
  getNotificationPreferenceByRecipientIdService,
} from "../services/notificationPreferenceService.js";

export async function startNotificationWorker() {
  const channel = getChannel();

  console.log(
    "Notification Worker Started"
  );

channel.consume(
  NOTIFICATION_QUEUE,
  async (message) => {
    if (!message) return;

    const notification = JSON.parse(
      message.content.toString()
    );

    try {

      await updateNotificationStatusService(
        notification.id,
        "PROCESSING"
      );

      const preferences =
  await getNotificationPreferenceByRecipientIdService(
    notification.recipient_id
  );

if (preferences) {
  if (
    notification.channel === "EMAIL" &&
    !preferences.email_enabled
  ) {
    console.log(
      `EMAIL disabled for recipient ${notification.recipient_id}`
    );

    await updateNotificationStatusService(
      notification.id,
      "SKIPPED"
    );

    channel.ack(message);
    return;
  }

  if (
    notification.channel === "SMS" &&
    !preferences.sms_enabled
  ) {
    console.log(
      `SMS disabled for recipient ${notification.recipient_id}`
    );

    await updateNotificationStatusService(
      notification.id,
      "SKIPPED"
    );

    channel.ack(message);
    return;
  }
}

      console.log(
        `Processing Notification: ${notification.id}`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      await updateNotificationStatusService(
        notification.id,
        "DELIVERED"
      );

      console.log(
        `Notification Delivered: ${notification.id}`
      );

      channel.ack(message);
    } catch (error) {
      console.error(
          `Notification Failed: ${notification.id}`
        );

  const updatedNotification =
    await incrementRetryCountService(
      notification.id
    );

  if (
    updatedNotification.retry_count <
    updatedNotification.max_retries
  ) {
    console.log(
      `Retrying Notification: ${notification.id}`
    );

    channel.sendToQueue(
      NOTIFICATION_QUEUE,
      Buffer.from(
        JSON.stringify(updatedNotification)
      ),
      {
        persistent: true,
      }
    );
  } else {
    await updateNotificationStatusService(
  notification.id,
  "FAILED"
);

channel.sendToQueue(
  DEAD_LETTER_QUEUE,
  Buffer.from(
    JSON.stringify(updatedNotification)
  ),
  {
    persistent: true,
  }
  );

   console.log(
  `Moved To DLQ: ${notification.id}`
          );
        }

  channel.ack(message);
    }
  }
  );
}