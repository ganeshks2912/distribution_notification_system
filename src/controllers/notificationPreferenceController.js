import {
  getNotificationPreferenceByRecipientIdService,
  updateNotificationPreferenceService,
} from "../services/notificationPreferenceService.js";

export async function getNotificationPreference(
  req,
  res
) {
  try {
    const { recipientId } = req.params;

    const preferences =
      await getNotificationPreferenceByRecipientIdService(
        recipientId
      );

    if (!preferences) {
      return res.status(404).json({
        success: false,
        message:
          "Notification preferences not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch notification preferences",
    });
  }
}

export async function updateNotificationPreference(
  req,
  res
) {
  try {
    const { recipientId } = req.params;

    const {
      emailEnabled,
      smsEnabled,
      marketingEnabled,
    } = req.body;

    const updatedPreference =
      await updateNotificationPreferenceService(
        recipientId,
        {
          emailEnabled,
          smsEnabled,
          marketingEnabled,
        }
      );

    if (!updatedPreference) {
      return res.status(404).json({
        success: false,
        message:
          "Notification preferences not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Notification preferences updated successfully",
      data: updatedPreference,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to update notification preferences",
    });
  }
}