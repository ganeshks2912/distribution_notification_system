import {
  getChannel,
  NOTIFICATION_QUEUE,
} from "../config/rabbitmq.js";

export async function publishNotification(
  notification
) {
  const channel = getChannel();

  channel.sendToQueue(
    NOTIFICATION_QUEUE,
    Buffer.from(
      JSON.stringify(notification)
    ),
    {
      persistent: true,
    }
  );

  console.log(
    `Notification Published: ${notification.id}`
  );
}