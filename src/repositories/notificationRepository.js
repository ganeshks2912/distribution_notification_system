
import pool from "../config/db.js";

export async function createNotification(notificationData) {
  const {
    recipientId,
    channel,
    subject,
    content,
    priority,
    idempotencyKey,
  } = notificationData;

  const query = `
    INSERT INTO notifications (
      recipient_id,
      channel,
      subject,
      content,
      priority,
      idempotency_key
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *;
  `;

  const values = [
    recipientId,
    channel,
    subject,
    content,
    priority,
    idempotencyKey,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}

export async function findNotificationById(id) {
  const query = `
    SELECT *
    FROM notifications
    WHERE id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
}

export async function getAllNotifications() {
  const query = `
    SELECT *
    FROM notifications
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
}

export async function findNotificationByIdempotencyKey(
  idempotencyKey
) {
  const query = `
    SELECT *
    FROM notifications
    WHERE idempotency_key = $1;
  `;

  const result = await pool.query(query, [
    idempotencyKey,
  ]);

  return result.rows[0];
}

export async function updateNotificationStatus(
  notificationId,
  status
) {
  const query = `
    UPDATE notifications
    SET
      status = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `;

  const values = [status, notificationId];

  const result = await pool.query(
    query,
    values
  );

  return result.rows[0];
}

export async function incrementRetryCount(
  notificationId
) {
  const query = `
    UPDATE notifications
    SET
      retry_count = retry_count + 1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(
    query,
    [notificationId]
  );

  return result.rows[0];
}