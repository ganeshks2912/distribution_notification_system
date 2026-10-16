import pool from "../config/db.js";


export async function markScheduledNotificationAsSent(
  scheduledNotificationId
) {
  const query = `
    UPDATE scheduled_notifications
    SET status = 'SENT_TO_QUEUE'
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [
    scheduledNotificationId,
  ]);

  return result.rows[0];
}

export async function getDueScheduledNotificationsWithDetails() {
  const query = `
    SELECT
      sn.id AS scheduled_notification_id,
      sn.scheduled_for,

      n.id,
      n.recipient_id,
      n.template_id,
      n.channel,
      n.subject,
      n.content,
      n.priority,
      n.status,
      n.retry_count,
      n.max_retries,
      n.idempotency_key,
      n.created_at,
      n.updated_at

    FROM scheduled_notifications sn
    JOIN notifications n
      ON sn.notification_id = n.id

    WHERE
      sn.status = 'PENDING'
      AND sn.scheduled_for <= NOW();
  `;

  const result = await pool.query(query);

  return result.rows;
}

export async function createScheduledNotification(
  notificationId,
  scheduledFor
) {
  const query = `
    INSERT INTO scheduled_notifications (
      notification_id,
      scheduled_for
    )
    VALUES ($1, $2)
    RETURNING *;
  `;

  const result = await pool.query(query, [
    notificationId,
    scheduledFor,
  ]);

  return result.rows[0];
}