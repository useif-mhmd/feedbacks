import { Router } from "express";
import mongoose from "mongoose";
import { FeedbackModel, CustomerModel } from "../models/index.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Helper to check if MongoDB is available
const isMongoAvailable = () => mongoose.connection.readyState === 1;

// Get comprehensive overview statistics
router.get("/overview", async (req, res) => {
  try {
    const userId = req.user!.userId;

    if (!isMongoAvailable()) {
      // Return mock data when DB is not available
      return res.json({
        totalMessages: 150,
        messagesSentThisMonth: 45,
        totalResponses: 89,
        responsesThisMonth: 28,
        positiveRatings: 67,
        negativeRatings: 22,
        averageRating: 4.2,
        totalCustomers: 120,
        customersThisMonth: 15,
        responseRate: 62,
        sourceBreakdown: {
          whatsapp: 45,
          email: 32,
          sms: 12,
        },
        monthlyTrend: [
          { month: "يناير", messages: 30, responses: 18, positiveRatings: 14 },
          { month: "فبراير", messages: 42, responses: 25, positiveRatings: 19 },
          { month: "مارس", messages: 45, responses: 28, positiveRatings: 22 },
        ],
      });
    }

    // Get current month start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Run all queries in parallel for better performance
    const [
      totalCustomers,
      customersThisMonth,
      totalFeedback,
      feedbackThisMonth,
      positiveFeedback,
      negativeFeedback,
      averageRatingResult,
      sourceBreakdown,
    ] = await Promise.all([
      // Total customers
      CustomerModel.countDocuments({ userId }),
      
      // Customers added this month
      CustomerModel.countDocuments({
        userId,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      }),
      
      // Total feedback/responses
      FeedbackModel.countDocuments({ userId }),
      
      // Feedback this month
      FeedbackModel.countDocuments({
        userId,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      }),
      
      // Positive ratings (4-5 stars)
      FeedbackModel.countDocuments({
        userId,
        rating: { $gte: 4 }
      }),
      
      // Negative ratings (1-3 stars)
      FeedbackModel.countDocuments({
        userId,
        rating: { $lte: 3 }
      }),
      
      // Average rating
      FeedbackModel.aggregate([
        { $match: { userId } },
        { $group: { _id: null, avg: { $avg: "$rating" } } }
      ]),
      
      // Source breakdown
      FeedbackModel.aggregate([
        { $match: { userId } },
        { $group: { _id: "$source", count: { $sum: 1 } } }
      ]),
    ]);

    // Process source breakdown
    const sources = { whatsapp: 0, email: 0, sms: 0 };
    sourceBreakdown.forEach((item: any) => {
      if (item._id && sources.hasOwnProperty(item._id)) {
        sources[item._id as keyof typeof sources] = item.count;
      }
    });

    // Calculate response rate (assuming we sent messages equal to total customers)
    const responseRate = totalCustomers > 0 
      ? Math.round((totalFeedback / totalCustomers) * 100) 
      : 0;

    // For now, assume messages sent = customers (in real app, you'd track this separately)
    const totalMessages = totalCustomers;
    const messagesSentThisMonth = customersThisMonth;

    // Get monthly trend (last 3 months)
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const monthlyTrend = await FeedbackModel.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: threeMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          responses: { $sum: 1 },
          positiveRatings: {
            $sum: { $cond: [{ $gte: ["$rating", 4] }, 1, 0] }
          }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Convert month numbers to Arabic names
    const monthNames = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];

    const formattedMonthlyTrend = monthlyTrend.map((item: any) => ({
      month: monthNames[item._id.month - 1],
      messages: item.responses, // Approximate
      responses: item.responses,
      positiveRatings: item.positiveRatings
    }));

    const stats = {
      totalMessages,
      messagesSentThisMonth,
      totalResponses: totalFeedback,
      responsesThisMonth: feedbackThisMonth,
      positiveRatings: positiveFeedback,
      negativeRatings: negativeFeedback,
      averageRating: averageRatingResult[0]?.avg || 0,
      totalCustomers,
      customersThisMonth,
      responseRate,
      sourceBreakdown: sources,
      monthlyTrend: formattedMonthlyTrend,
    };

    console.log(`📊 Stats loaded for user ${userId}:`, {
      customers: totalCustomers,
      feedback: totalFeedback,
      responseRate: responseRate + '%'
    });

    res.json(stats);
  } catch (error) {
    console.error("Error loading overview stats:", error);
    res.status(500).json({
      error: "Failed to load statistics",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get detailed feedback statistics
router.get("/feedback-details", async (req, res) => {
  try {
    const userId = req.user!.userId;

    if (!isMongoAvailable()) {
      return res.json({
        ratingDistribution: [
          { rating: 1, count: 3 },
          { rating: 2, count: 5 },
          { rating: 3, count: 14 },
          { rating: 4, count: 28 },
          { rating: 5, count: 39 },
        ],
        dailyFeedback: [],
        topNegativeReasons: [
          { reason: "بطء في الخدمة", count: 8 },
          { reason: "جودة الطعام", count: 5 },
          { reason: "أسعار مرتفعة", count: 3 },
        ],
      });
    }

    const [ratingDistribution, topNegativeReasons] = await Promise.all([
      // Rating distribution
      FeedbackModel.aggregate([
        { $match: { userId } },
        { $group: { _id: "$rating", count: { $sum: 1 } } },
        { $sort: { "_id": 1 } }
      ]),

      // Top negative feedback reasons
      FeedbackModel.aggregate([
        { 
          $match: { 
            userId, 
            rating: { $lte: 3 }, 
            reason: { $exists: true, $ne: null, $nin: ["", null] } 
          } 
        },
        { $group: { _id: "$reason", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
    ]);

    const formattedRatingDistribution = ratingDistribution.map((item: any) => ({
      rating: item._id,
      count: item.count
    }));

    const formattedNegativeReasons = topNegativeReasons.map((item: any) => ({
      reason: item._id,
      count: item.count
    }));

    res.json({
      ratingDistribution: formattedRatingDistribution,
      topNegativeReasons: formattedNegativeReasons,
    });
  } catch (error) {
    console.error("Error loading feedback details:", error);
    res.status(500).json({
      error: "Failed to load feedback statistics",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get customer statistics
router.get("/customers", async (req, res) => {
  try {
    const userId = req.user!.userId;

    if (!isMongoAvailable()) {
      return res.json({
        totalCustomers: 120,
        activeCustomers: 89,
        newThisMonth: 15,
        growthRate: 12.5,
        avgResponseTime: "2.4 hours",
      });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalCustomers,
      newThisMonth,
      newLastMonth,
      customersWithFeedback
    ] = await Promise.all([
      CustomerModel.countDocuments({ userId }),
      
      CustomerModel.countDocuments({
        userId,
        createdAt: { $gte: startOfMonth }
      }),
      
      CustomerModel.countDocuments({
        userId,
        createdAt: { $gte: lastMonth, $lte: endOfLastMonth }
      }),
      
      CustomerModel.countDocuments({
        userId,
        _id: { 
          $in: await FeedbackModel.distinct("customerId", { userId })
        }
      })
    ]);

    const growthRate = newLastMonth > 0 
      ? ((newThisMonth - newLastMonth) / newLastMonth) * 100 
      : 0;

    res.json({
      totalCustomers,
      activeCustomers: customersWithFeedback,
      newThisMonth,
      growthRate: Math.round(growthRate * 10) / 10,
      avgResponseTime: "2.4 hours", // This would need message tracking to calculate properly
    });
  } catch (error) {
    console.error("Error loading customer stats:", error);
    res.status(500).json({
      error: "Failed to load customer statistics",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
