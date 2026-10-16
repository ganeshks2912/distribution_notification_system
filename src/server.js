import app from "./app.js";
import pool from "./config/db.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import { startNotificationWorker } from "./workers/notificationWorker.js";
import { startSchedulerWorker }
from "./workers/schedulerWorker.js";

const PORT = process.env.PORT || 5000;

pool
  .query("SELECT NOW()")
  .then(async () => {
    console.log(
      "Database Connected Successfully"
    );

    await connectRabbitMQ();

    await startNotificationWorker();

    startSchedulerWorker();

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "Database Connection Failed"
    );

    console.error(error.message);

    process.exit(1);
  });