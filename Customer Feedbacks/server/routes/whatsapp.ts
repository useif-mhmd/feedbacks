import { Router } from "express";
import { whatsappManager } from "../services/whatsappManager.js";
import { authenticate } from "../middleware/auth.js";
import { WhatsAppStatus, SendMessageRequest } from "../../shared/types.js";

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Get WhatsApp status and QR code for the authenticated user
router.get("/status", (req, res) => {
  try {
    const userId = req.user!.userId;
    const userClient = whatsappManager.getUserClient(userId);
    const status = userClient.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({
      error: "Failed to get WhatsApp status",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Initialize WhatsApp connection for the authenticated user
router.post("/initialize", async (req, res) => {
  try {
    const userId = req.user!.userId;
    console.log(`🚀 Initializing WhatsApp for user: ${userId}`);

    const userClient = whatsappManager.getUserClient(userId);
    await userClient.initialize();
    const status = userClient.getStatus();

    res.json({ success: true, status });
  } catch (error) {
    console.error(`❌ Failed to initialize WhatsApp for user ${req.user!.userId}:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to initialize WhatsApp",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Reset WhatsApp authentication (for new phone number)
router.post("/reset-auth", async (req, res) => {
  try {
    const userId = req.user!.userId;
    console.log(`🔄 Resetting WhatsApp auth for user: ${userId}`);

    const userClient = whatsappManager.getUserClient(userId);
    await userClient.resetAuth();
    const status = userClient.getStatus();

    res.json({
      success: true,
      status,
      message: "Authentication reset successfully. Ready for new QR scan.",
    });
  } catch (error) {
    console.error(`❌ Failed to reset WhatsApp auth for user ${req.user!.userId}:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to reset WhatsApp authentication",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Send bulk WhatsApp messages
router.post("/send-bulk", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { customers }: SendMessageRequest = req.body;

    if (!customers || !Array.isArray(customers) || customers.length === 0) {
      return res.status(400).json({ error: "No customers provided" });
    }

    const userClient = whatsappManager.getUserClient(userId);
    const results = await userClient.sendBulkMessages(customers);

    res.json({
      success: true,
      ...results,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to send bulk messages",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Send single WhatsApp message
router.post("/send-message", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({ error: "Phone and message are required" });
    }

    const userClient = whatsappManager.getUserClient(userId);
    const success = await userClient.sendMessage(phone, message);

    res.json({
      success,
      message: success ? "Message sent" : "Failed to send message",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to send message",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
