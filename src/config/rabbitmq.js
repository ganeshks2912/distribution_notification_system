// RabbitMQ configuration
import amqp from "amqplib";

let channel;

const NOTIFICATION_QUEUE =
  "notification_queue";

const DEAD_LETTER_QUEUE =
  "dead_letter_queue";

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(
      "amqp://localhost"
    );

    channel = await connection.createChannel();

     await channel.assertQueue(
      NOTIFICATION_QUEUE,
      {
        durable: true,
      }
     );

     await channel.assertQueue(
       DEAD_LETTER_QUEUE,
         {
          durable: true,
        }
       );

    console.log(
      "RabbitMQ Connected Successfully"
    );
  } catch (error) {
    console.error(
      "RabbitMQ Connection Failed"
    );

    console.error(error.message);

    process.exit(1);
  }
}

export function getChannel() {
  return channel;
}
export { NOTIFICATION_QUEUE ,DEAD_LETTER_QUEUE,};