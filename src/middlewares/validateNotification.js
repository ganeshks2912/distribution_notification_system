export const validateNotification = (req, res, next) => {
  const {
    recipientId,
    channel,
    content,
    priority,
  } = req.body;

  if (!recipientId) {
    return res.status(400).json({
      success: false,
      message: "Recipient ID is required",
    });
  }

  if (!channel) {
    return res.status(400).json({
      success: false,
      message: "Channel is required",
    });
  }

  if (!content) {
    return res.status(400).json({
      success: false,
      message: "Content is required",
    });
  }

  const allowedChannels = ["EMAIL", "SMS"];

  if (!allowedChannels.includes(channel)) {
    return res.status(400).json({
      success: false,
      message: "Invalid channel",
    });
  }

  const allowedPriorities = ["HIGH", "MEDIUM", "LOW"];

  if (
    priority &&
    !allowedPriorities.includes(priority)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid priority",
    });
  }

  next();
};