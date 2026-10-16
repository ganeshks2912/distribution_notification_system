import {
  getNotificationPreferenceByRecipientId,
  updateNotificationPreference,
} from "../repositories/notificationPreferenceRepository.js";

export async function getNotificationPreferenceByRecipientIdService(
  recipientId
) {
  return await getNotificationPreferenceByRecipientId(
    recipientId
  );
}
export async function updateNotificationPreferenceService(
  recipientId,
  preferenceData
) {
  return await updateNotificationPreference(
    recipientId,
    preferenceData
  );
}