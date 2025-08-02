import { Router } from "express";
import mongoose from "mongoose";
import { CustomerModel, FeedbackModel } from "../models/index.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Helper to check if MongoDB is available
const isMongoAvailable = () => mongoose.connection.readyState === 1;

// Migrate old customers to new user-based system
router.post("/migrate-customers", async (req, res) => {
  try {
    const userId = req.user!.userId;

    if (!isMongoAvailable()) {
      return res.json({
        success: false,
        message: "Database not available"
      });
    }

    // Find customers without userId
    const customersWithoutUserId = await CustomerModel.find({
      $or: [
        { userId: { $exists: false } },
        { userId: null },
        { userId: "" }
      ]
    });

    let migratedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    for (const customer of customersWithoutUserId) {
      try {
        // Check if this user already has a customer with this phone
        const existingUserCustomer = await CustomerModel.findOne({
          phone: customer.phone,
          userId: userId
        });

        if (existingUserCustomer) {
          // User already has this customer, skip or merge
          skippedCount++;
          console.log(`Skipped ${customer.phone} - user already has this customer`);
        } else {
          // Assign this customer to the current user
          customer.userId = userId;
          await customer.save();
          migratedCount++;
          console.log(`✅ Migrated customer ${customer.phone} to user ${userId}`);
        }
      } catch (error) {
        const errorMsg = `Failed to migrate customer ${customer.phone}: ${error}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    // Also migrate feedback
    const feedbackWithoutUserId = await FeedbackModel.find({
      $or: [
        { userId: { $exists: false } },
        { userId: null },
        { userId: "" }
      ]
    });

    let migratedFeedbackCount = 0;
    for (const feedback of feedbackWithoutUserId) {
      try {
        // Find if the customer belongs to current user
        const customer = await CustomerModel.findOne({
          phone: feedback.customerPhone,
          userId: userId
        });

        if (customer) {
          feedback.userId = userId;
          await feedback.save();
          migratedFeedbackCount++;
        }
      } catch (error) {
        console.error(`Failed to migrate feedback: ${error}`);
      }
    }

    res.json({
      success: true,
      message: "Migration completed",
      results: {
        customersTotal: customersWithoutUserId.length,
        customersMigrated: migratedCount,
        customersSkipped: skippedCount,
        feedbackMigrated: migratedFeedbackCount,
        errors: errors
      }
    });

  } catch (error) {
    console.error("Migration error:", error);
    res.status(500).json({
      success: false,
      message: "Migration failed",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Clean up duplicate customers
router.post("/cleanup-duplicates", async (req, res) => {
  try {
    const userId = req.user!.userId;

    if (!isMongoAvailable()) {
      return res.json({
        success: false,
        message: "Database not available"
      });
    }

    // Find duplicate phone numbers for this user
    const duplicates = await CustomerModel.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: "$phone", count: { $sum: 1 }, customers: { $push: "$$ROOT" } } },
      { $match: { count: { $gt: 1 } } }
    ]);

    let cleanedCount = 0;
    const errors: string[] = [];

    for (const duplicate of duplicates) {
      try {
        // Keep the first customer, remove the rest
        const [keepCustomer, ...removeCustomers] = duplicate.customers;
        
        for (const customerToRemove of removeCustomers) {
          await CustomerModel.findByIdAndDelete(customerToRemove._id);
          cleanedCount++;
          console.log(`🗑️ Removed duplicate customer: ${customerToRemove.phone}`);
        }
      } catch (error) {
        const errorMsg = `Failed to clean duplicate ${duplicate._id}: ${error}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    res.json({
      success: true,
      message: "Cleanup completed",
      results: {
        duplicateGroups: duplicates.length,
        customersRemoved: cleanedCount,
        errors: errors
      }
    });

  } catch (error) {
    console.error("Cleanup error:", error);
    res.status(500).json({
      success: false,
      message: "Cleanup failed",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;
