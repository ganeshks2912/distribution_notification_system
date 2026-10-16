// Notification controller
import {
  createNotificationService,
  getNotificationByIdService,
  getAllNotificationsService,
} from "../services/notificationService.js";

export async function createNotificationController(req, res) {
  try {
    const notification = await createNotificationService(req.body);

    return res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getNotificationByIdController(req, res) {
  try {
    const notification = await getNotificationByIdService(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAllNotificationsController(req, res) {
  try {
    const notifications = await getAllNotificationsService();

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}