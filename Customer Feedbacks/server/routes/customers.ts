import { Router } from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { CustomerModel } from "../models/index.js";
import { fileUploadService } from "../services/fileUpload.js";
import { whatsappManager } from "../services/whatsappManager.js";
import { emailService } from "../services/email.js";
import { mockStorage } from "../services/mockStorage.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Helper to check if MongoDB is available
const isMongoAvailable = () => mongoose.connection.readyState === 1;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".xlsx", ".xls"];
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error("يجب أن يكون الملف من نوع Excel (.xlsx أو .xls)"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

// Get all customers
router.get("/", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const customers = await CustomerModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CustomerModel.countDocuments({ userId });

    res.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to get customers",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Upload Excel file and process customers
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const userId = req.user!.userId;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await fileUploadService.processExcelFile(req.file.path, userId);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Failed to process file",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Send WhatsApp messages to customers
router.post("/send-whatsapp", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { customerIds } = req.body;

    if (!customerIds || !Array.isArray(customerIds)) {
      return res.status(400).json({ error: "Customer IDs are required" });
    }

    const customers = await CustomerModel.find({
      _id: { $in: customerIds },
      userId,
    });

    if (customers.length === 0) {
      return res.status(404).json({ error: "No customers found" });
    }

    const userClient = whatsappManager.getUserClient(userId);
    const results = await userClient.sendBulkMessages(
      customers.map((c) => ({ phone: c.phone, name: c.name })),
    );

    res.json({
      success: true,
      ...results,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to send WhatsApp messages",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Send emails to customers
router.post("/send-email", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { customerIds } = req.body;

    if (!customerIds || !Array.isArray(customerIds)) {
      return res.status(400).json({ error: "Customer IDs are required" });
    }

    const customers = await CustomerModel.find({
      _id: { $in: customerIds },
      userId,
      email: { $exists: true, $ne: null, $nin: ["", null] },
    });

    if (customers.length === 0) {
      return res.status(404).json({ error: "No customers with email found" });
    }

    const results = await emailService.sendBulkEmails(
      customers.map((c) => ({ email: c.email!, name: c.name, phone: c.phone })),
      userId
    );

    res.json({
      success: true,
      ...results,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to send emails",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Send SMS to customers (placeholder - requires SMS service integration)
router.post("/send-sms", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { customerIds } = req.body;

    if (!customerIds || !Array.isArray(customerIds)) {
      return res.status(400).json({ error: "Customer IDs are required" });
    }

    const customers = await CustomerModel.find({
      _id: { $in: customerIds },
      userId,
    });

    if (customers.length === 0) {
      return res.status(404).json({ error: "No customers found" });
    }

    // TODO: Integrate with SMS service (Twilio, etc.)
    console.log(`📱 Would send SMS to ${customers.length} customers`);

    res.json({
      success: true,
      sent: customers.length,
      failed: 0,
      errors: [],
      message: "SMS functionality not yet implemented",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to send SMS messages",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Delete customer
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const customer = await CustomerModel.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ success: true, message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete customer",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
