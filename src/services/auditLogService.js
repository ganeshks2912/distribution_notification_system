import { createAuditLog } from "../repositories/auditLogRepository.js";

export async function createAuditLogService(
  notificationId,
  eventType,
  details
) {
  return await createAuditLog(
    notificationId,
    eventType,
    details
  );
}