import pool from "../config/db.js";

export async function createAuditLog(
  notificationId,
  eventType,
  details
) {
  const query = `
    INSERT INTO audit_logs (
      notification_id,
      event_type,
      details
    )
    VALUES ($1,$2,$3)
    RETURNING *;
  `;

  const values = [
    notificationId,
    eventType,
    details,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
}