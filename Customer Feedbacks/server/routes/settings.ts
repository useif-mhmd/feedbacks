import { Router } from "express";
import mongoose from "mongoose";
import { SettingsModel } from "../models/index.js";
import { mockStorage } from "../services/mockStorage.js";
import { authenticate } from "../middleware/auth.js";
import { Settings } from "../../shared/types.js";
import { emailService } from "../services/email.js";

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Helper to check if MongoDB is available
const isMongoAvailable = () => mongoose.connection.readyState === 1;

// Get settings
router.get("/", async (req, res) => {
  try {
    const userId = req.user!.userId;

    if (!isMongoAvailable()) {
      // Use mock storage
      const settings = mockStorage.getSettings();
      const responseSettings = {
        ...settings,
        smtpConfig: {
          ...settings.smtpConfig,
          password: settings.smtpConfig.password ? "***" : "",
        },
      };
      return res.json(responseSettings);
    }

    let settings = await SettingsModel.findOne({ userId });

    if (!settings) {
      // Create default settings for this user
      settings = await SettingsModel.create({
        userId,
        whatsappConnected: false,
        smtpConfig: {
          email: "",
          password: "",
          host: "smtp.gmail.com",
          port: 587,
        },
        smsMessage:
          "من فضلك قيم زيارتك من 1 إلى 5 عبر الرد على الرسالة. شكراً!",
        googleMapsLink: "https://maps.google.com/your-business-location",
      });
    }

    // Don't send password in response
    const responseSettings = {
      ...settings.toObject(),
      smtpConfig: {
        ...settings.smtpConfig,
        password: settings.smtpConfig.password ? "***" : "",
      },
    };

    res.json(responseSettings);
  } catch (error) {
    res.status(500).json({
      error: "Failed to get settings",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update SMTP settings
router.put("/smtp", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { email, password, host, port } = req.body;

    if (!email || !password || !host || !port) {
      return res.status(400).json({ error: "All SMTP fields are required" });
    }

    if (!isMongoAvailable()) {
      // Use mock storage
      const settings = mockStorage.updateSmtpConfig({
        email,
        password,
        host,
        port: parseInt(port),
      });
      const responseSettings = {
        ...settings,
        smtpConfig: {
          ...settings.smtpConfig,
          password: "***",
        },
      };
      return res.json({ success: true, settings: responseSettings });
    }

    let settings = await SettingsModel.findOne({ userId });

    if (!settings) {
      settings = new SettingsModel({ userId });
    }

    settings.smtpConfig = { email, password, host, port: parseInt(port) };
    await settings.save();

    // إبطال cache الـ transporter لهذا المستخدم لاستخدام الإعدادات الجديدة
    emailService.invalidateTransporter(userId);

    // Don't send password in response
    const responseSettings = {
      ...settings.toObject(),
      smtpConfig: {
        ...settings.smtpConfig,
        password: "***",
      },
    };

    res.json({ success: true, settings: responseSettings });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update SMTP settings",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update SMS message
router.put("/sms-message", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "SMS message is required" });
    }

    if (!isMongoAvailable()) {
      // Use mock storage
      const settings = mockStorage.updateSmsMessage(message);
      return res.json({ success: true, settings });
    }

    let settings = await SettingsModel.findOne({ userId });

    if (!settings) {
      settings = new SettingsModel({ userId });
    }

    settings.smsMessage = message;
    await settings.save();

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update SMS message",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update WhatsApp connection status
router.put("/whatsapp-status", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { connected } = req.body;

    if (!isMongoAvailable()) {
      // Use mock storage
      const settings = mockStorage.updateSettings({
        whatsappConnected: connected,
      });
      return res.json({ success: true, settings });
    }

    let settings = await SettingsModel.findOne({ userId });

    if (!settings) {
      settings = new SettingsModel({ userId });
    }

    settings.whatsappConnected = connected;
    await settings.save();

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update WhatsApp status",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update Google Maps link
router.put("/google-maps-link", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { link } = req.body;

    if (!link) {
      return res.status(400).json({ error: "Google Maps link is required" });
    }

    if (!isMongoAvailable()) {
      // Use mock storage
      const settings = mockStorage.updateSettings({ googleMapsLink: link });
      return res.json({ success: true, settings });
    }

    let settings = await SettingsModel.findOne({ userId });

    if (!settings) {
      settings = new SettingsModel({ userId });
    }

    settings.googleMapsLink = link;
    await settings.save();

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update Google Maps link",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
