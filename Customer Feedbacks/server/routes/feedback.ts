import { Router } from "express";
import mongoose from "mongoose";
import { FeedbackModel, CustomerModel } from "../models/index.js";
import { mockStorage } from "../services/mockStorage.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Helper to check if MongoDB is available
const isMongoAvailable = () => mongoose.connection.readyState === 1;

// Get all feedback
router.get("/", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Filter parameters
    const rating = req.query.rating
      ? parseInt(req.query.rating as string)
      : undefined;
    const source = req.query.source as string;
    const status = req.query.status as string;

    // Build filter query
    const filter: any = { userId };

    if (rating !== undefined) {
      filter.rating = rating;
    }

    if (source) {
      filter.source = source;
    }

    if (status) {
      filter.status = status;
    }

    const feedback = await FeedbackModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await FeedbackModel.countDocuments(filter);

    res.json({
      feedback,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to get feedback",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get negative feedback (rating < 4)
router.get("/negative", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    if (!isMongoAvailable()) {
      // Use mock storage
      const allFeedback = mockStorage.getNegativeFeedback();
      const feedback = allFeedback.slice(skip, skip + limit);
      const total = allFeedback.length;

      return res.json({
        feedback,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    }

    const feedback = await FeedbackModel.find({
      userId,
      rating: { $lt: 4 },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await FeedbackModel.countDocuments({
      userId,
      rating: { $lt: 4 },
    });

    res.json({
      feedback,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to get negative feedback",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get feedback statistics
router.get("/stats", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const [
      totalFeedback,
      positiveFeedback,
      negativeFeedback,
      avgRating,
      sourceStats,
      recentFeedback,
    ] = await Promise.all([
      FeedbackModel.countDocuments({ userId }),
      FeedbackModel.countDocuments({ userId, rating: { $gte: 4 } }),
      FeedbackModel.countDocuments({ userId, rating: { $lt: 4 } }),
      FeedbackModel.aggregate([
        { $match: { userId } },
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]),
      FeedbackModel.aggregate([
        { $match: { userId } },
        { $group: { _id: "$source", count: { $sum: 1 } } },
      ]),
      FeedbackModel.find({ userId }).sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      total: totalFeedback,
      positive: positiveFeedback,
      negative: negativeFeedback,
      averageRating: avgRating[0]?.avg || 0,
      bySource: sourceStats,
      recent: recentFeedback,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to get feedback statistics",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update feedback status
router.put("/:id/status", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { status } = req.body;

    if (!["pending", "processed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const feedback = await FeedbackModel.findOneAndUpdate(
      { _id: req.params.id, userId },
      { status },
      { new: true },
    );

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update feedback status",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Add manual feedback (for testing)
router.post("/", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { customerPhone, rating, reason, source = "manual" } = req.body;

    if (!customerPhone || !rating) {
      return res
        .status(400)
        .json({ error: "Customer phone and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Find or create customer for this user
    let customer = await CustomerModel.findOne({ phone: customerPhone, userId });

    if (!customer) {
      customer = await CustomerModel.create({
        userId,
        phone: customerPhone,
        name: `عميل ${customerPhone.slice(-4)}`,
      });
    }

    const feedback = await FeedbackModel.create({
      userId,
      customerId: customer._id!.toString(),
      customerPhone: customerPhone,
      customerName: customer.name,
      rating,
      reason,
      source,
      status: "pending",
    });

    res.json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create feedback",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Delete feedback
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user!.userId;
    const feedback = await FeedbackModel.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json({ success: true, message: "Feedback deleted" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete feedback",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
