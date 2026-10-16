import express from "express";

import {
  getNotificationPreference,
  updateNotificationPreference,
} from "../controllers/notificationPreferenceController.js";

const router = express.Router();

router.get(
  "/:recipientId",
  getNotificationPreference
);

router.put(
  "/:recipientId",
  updateNotificationPreference
);

export default router;