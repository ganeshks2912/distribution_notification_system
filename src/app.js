import express from "express";
import notificationRoutes from "./routes/notificationRoutes.js";
import notificationPreferenceRoutes
from "./routes/notificationPreferenceRoutes.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/notifications", notificationRoutes);
app.use(
  "/preferences",
  notificationPreferenceRoutes
);

export default app;