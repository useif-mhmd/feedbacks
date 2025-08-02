import { Router } from "express";
import mongoose from "mongoose";
import crypto from "crypto";
import { FeedbackModel, CustomerModel, SettingsModel } from "../models/index.js";
import { mockStorage } from "../services/mockStorage.js";
import { emailService } from "../services/email.js";

const router = Router();

// Helper to check if MongoDB is available
const isMongoAvailable = () => mongoose.connection.readyState === 1;

// Store for rating tokens (in production, use Redis or database)
const ratingTokens = new Map<string, {
  userId: string;
  customerId: string;
  customerEmail: string;
  customerName?: string;
  customerPhone: string;
  expiresAt: number;
}>();

// Generate a secure rating token
export function generateRatingToken(
  userId: string,
  customerId: string,
  customerEmail: string,
  customerName?: string,
  customerPhone: string = ""
): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
  
  ratingTokens.set(token, {
    userId,
    customerId,
    customerEmail,
    customerName,
    customerPhone,
    expiresAt
  });
  
  return token;
}

// Validate rating token
function validateRatingToken(token: string) {
  const tokenData = ratingTokens.get(token);
  if (!tokenData) {
    return null;
  }
  
  if (Date.now() > tokenData.expiresAt) {
    ratingTokens.delete(token);
    return null;
  }
  
  return tokenData;
}

// Get rating page data
router.get("/token/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const tokenData = validateRatingToken(token);
    
    if (!tokenData) {
      return res.status(404).json({
        success: false,
        message: "رابط التقييم غير صالح أو منتهي الصلاحية"
      });
    }

    // Get settings for branding
    let settings;
    if (isMongoAvailable()) {
      settings = await SettingsModel.findOne({ userId: tokenData.userId });
    } else {
      settings = mockStorage.getSettings();
    }

    res.json({
      success: true,
      data: {
        customerName: tokenData.customerName,
        companyName: settings?.userId ? "شركتنا" : "مؤسستنا", // You might want to get actual company name from users table
        token
      }
    });
  } catch (error) {
    console.error("Error getting rating page data:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ في تحميل الصفحة"
    });
  }
});

// Submit rating
router.post("/submit", async (req, res) => {
  try {
    const { token, rating, reason } = req.body;
    
    if (!token || !rating) {
      return res.status(400).json({
        success: false,
        message: "البيانات المطلوبة غير مكتملة"
      });
    }

    const tokenData = validateRatingToken(token);
    if (!tokenData) {
      return res.status(404).json({
        success: false,
        message: "رابط التقييم غير صالح أو منتهي الصلاحية"
      });
    }

    const ratingValue = parseInt(rating);
    if (ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({
        success: false,
        message: "التقييم يجب أن يكون بين 1 و 5"
      });
    }

    // Save feedback
    let feedback;
    if (isMongoAvailable()) {
      feedback = await FeedbackModel.create({
        userId: tokenData.userId,
        customerId: tokenData.customerId,
        customerPhone: tokenData.customerPhone,
        customerName: tokenData.customerName,
        rating: ratingValue,
        reason: reason || undefined,
        source: "web",
        status: "processed",
      });
    } else {
      feedback = mockStorage.addFeedback({
        userId: tokenData.userId,
        customerId: tokenData.customerId,
        customerPhone: tokenData.customerPhone,
        customerName: tokenData.customerName,
        rating: ratingValue,
        reason: reason || undefined,
        source: "web",
        status: "processed",
      });
    }

    // Get settings for follow-up actions
    let settings;
    if (isMongoAvailable()) {
      settings = await SettingsModel.findOne({ userId: tokenData.userId });
    } else {
      settings = mockStorage.getSettings();
    }

    // Send appropriate follow-up email
    try {
      if (ratingValue >= 4) {
        // Send positive feedback email with Google Maps link
        await sendPositiveFeedbackEmail(
          tokenData.customerEmail,
          tokenData.userId,
          tokenData.customerName,
          settings?.googleMapsLink
        );
      } else {
        // Send thank you email for negative feedback
        await sendNegativeFeedbackThankYou(
          tokenData.customerEmail,
          tokenData.userId,
          tokenData.customerName
        );
      }
    } catch (emailError) {
      console.error("Error sending follow-up email:", emailError);
      // Don't fail the rating submission if email fails
    }

    // Invalidate token after use
    ratingTokens.delete(token);

    // Determine response based on rating
    let responseData: any = {
      success: true,
      rating: ratingValue,
      message: "شكراً لتقييمك!"
    };

    if (ratingValue >= 4) {
      responseData.googleMapsLink = settings?.googleMapsLink;
      responseData.showGoogleMaps = true;
    }

    res.json(responseData);
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ في حفظ التقييم"
    });
  }
});

// Helper function to send positive feedback email
async function sendPositiveFeedbackEmail(
  toEmail: string,
  userId: string,
  customerName?: string,
  googleMapsLink?: string
) {
  const finalGoogleMapsLink = googleMapsLink || "https://maps.google.com/your-business-location";
  
  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>شكراً لتقييمك</title>
      <style>
        body {
          font-family: 'Cairo', 'Tajawal', Arial, sans-serif;
          direction: rtl;
          text-align: right;
          background-color: #f0f9ff;
          margin: 0;
          padding: 20px;
        }
        .container {
          background-color: white;
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          color: #1d4ed8;
          margin-bottom: 30px;
        }
        .google-maps-btn {
          background: linear-gradient(135deg, #4285f4, #34a853);
          color: white;
          padding: 15px 30px;
          border-radius: 10px;
          text-decoration: none;
          display: inline-block;
          font-weight: bold;
          font-size: 18px;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .google-maps-btn:hover {
          transform: translateY(-2px);
        }
        .footer {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌟 شكراً لتقييمك الرائع!</h1>
          <p>${customerName ? `عزيزي ${customerName}` : "عزيزنا العميل"}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 18px; color: #1f2937;">
            يسعدنا أن تقييمك كان إيجابياً! 🎉
          </p>
          <p style="color: #6b7280;">
            هل يمكنك مشاركة تجربتك الرائعة معنا على Google Maps؟
          </p>
          
          <a href="${finalGoogleMapsLink}" class="google-maps-btn">
            🗺️ قيّمنا على Google Maps
          </a>
          
          <p style="color: #9ca3af; font-size: 14px;">
            تقييمك يساعد عملاء آخرين في اختيار خدماتنا
          </p>
        </div>
        
        <div class="footer">
          <p>شكراً لثقتكم بنا! ❤️</p>
          <p>فريق خدمة العملاء</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await emailService.sendCustomEmail(
    toEmail,
    userId,
    "🌟 شكراً لتقييمك الإيجابي!",
    htmlContent
  );
}

// Helper function to send thank you email for negative feedback
async function sendNegativeFeedbackThankYou(
  toEmail: string,
  userId: string,
  customerName?: string
) {
  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Cairo', 'Tajawal', Arial, sans-serif;
          direction: rtl;
          text-align: right;
          background-color: #f0fdf4;
          margin: 0;
          padding: 20px;
        }
        .container {
          background-color: white;
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          border-top: 4px solid #22c55e;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div style="text-align: center; color: #16a34a;">
          <h1>🙏 شكراً لصراحتك</h1>
          <p>${customerName ? `عزيزي ${customerName}` : "عزيزنا العميل"}</p>
        </div>
        
        <p style="font-size: 18px; color: #374151; line-height: 1.6;">
          نشكرك على أخذ الوقت لتقييم خدماتنا وتوضيح ملاحظاتك.
        </p>
        
        <p style="color: #6b7280;">
          ملاحظاتك مهمة جداً لنا وسنعمل على تحسين هذه النقاط في أقرب وقت.
          <br>
          نتطلع لخدمتك بشكل أفضل في المرة القادمة!
        </p>
        
        <div style="text-align: center; margin-top: 30px; color: #6b7280;">
          <p>مع أطيب التحيات ❤️</p>
          <p>فريق خدمة العملاء</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await emailService.sendCustomEmail(
    toEmail,
    userId,
    "🙏 شكراً لملاحظاتك القيمة",
    htmlContent
  );
}

export { generateRatingToken };
export default router;
