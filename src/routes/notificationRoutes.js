// Notification routes
import { Router } from "express";

import {
  createNotificationController,
  getNotificationByIdController,
  getAllNotificationsController,
} from "../controllers/notificationController.js";
import { validateNotification } from "../middlewares/validateNotification.js";

const router = Router();

router.get("/", getAllNotificationsController);

router.get("/:id", getNotificationByIdController);

router.post(
  "/",
  validateNotification,
  createNotificationController
);

export default router;