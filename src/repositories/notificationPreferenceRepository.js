import pool from "../config/db.js";

export async function getNotificationPreferenceByRecipientId(
  recipientId
) {
  const query = `
    SELECT *
    FROM notification_preferences
    WHERE recipient_id = $1
  `;

  const result = await pool.query(query, [
    recipientId,
  ]);

  return result.rows[0];
}

export async function updateNotificationPreference(
  recipientId,
  {
    emailEnabled,
    smsEnabled,
    marketingEnabled,
  }
) {
  const query = `
    UPDATE notification_preferences
    SET
      email_enabled = $2,
      sms_enabled = $3,
      marketing_enabled = $4,
      updated_at = CURRENT_TIMESTAMP
    WHERE recipient_id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [
    recipientId,
    emailEnabled,
    smsEnabled,
    marketingEnabled,
  ]);

  return result.rows[0];
}