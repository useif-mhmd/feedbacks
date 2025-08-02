import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import * as qrcode from "qrcode";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { BotStatus } from "@shared/types";
import { FeedbackModel, CustomerModel } from "../models/index.js";
import { mockStorage } from "./mockStorage.js";

class WhatsAppService {
  private client: Client | null = null;
  private qrCodeData: string | null = null;
  private botStatus: BotStatus = "not_initialized";
  private serverStartTime = new Date();
  private initialized = false;
  private autoRefreshInterval: NodeJS.Timeout | null = null;

  // Helper to check if MongoDB is available
  private isMongoAvailable(): boolean {
    return mongoose.connection.readyState === 1;
  }

  constructor() {
    // Don't initialize automatically to avoid startup crashes
  }

  async initialize() {
    if (this.initialized) return;

    try {
      this.botStatus = "initializing";
      await this.initializeClient();
      this.initialized = true;
      this.startAutoRefresh();
    } catch (error) {
      console.error("Failed to initialize WhatsApp service:", error);
      this.botStatus = "auth_failed";
      throw error;
    }
  }

  private startAutoRefresh() {
    // Clear any existing interval
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }

    // Start auto-refresh every 30 seconds
    this.autoRefreshInterval = setInterval(async () => {
      try {
        if (
          this.botStatus === "disconnected" ||
          this.botStatus === "auth_failed"
        ) {
          console.log("🔄 Auto-refreshing WhatsApp connection...");
          await this.reinitialize();
        }
      } catch (error) {
        console.error("Auto-refresh failed:", error);
      }
    }, 30000); // 30 seconds

    console.log("✅ Auto-refresh started (every 30 seconds)");
  }

  private stopAutoRefresh() {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
      this.autoRefreshInterval = null;
      console.log("🛑 Auto-refresh stopped");
    }
  }

  async reinitialize() {
    console.log("🔄 Reinitializing WhatsApp service...");
    this.stopAutoRefresh();
    this.initialized = false;

    if (this.client) {
      try {
        await this.client.destroy();
      } catch (error) {
        console.error("Error destroying client:", error);
      }
      this.client = null;
    }

    this.botStatus = "not_initialized";
    this.qrCodeData = null;

    await this.initialize();
  }

  private clearAuthData(): void {
    try {
      const sessionPath = path.join(process.cwd(), ".wwebjs_auth");
      if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
        console.log("✅ تم حذف بيانات المصادقة المحفوظة");
      }
    } catch (error) {
      console.error("خطأ في حذف بيانات المصادقة:", error);
    }
  }

  private async initializeClient(): Promise<void> {
    try {
      this.client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-web-security",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
            "--disable-gpu",
          ],
        },
      });

      this.client.on("qr", async (qr) => {
        console.log("🔄 تم إنشاء كود QR جديد");
        try {
          this.qrCodeData = await qrcode.toDataURL(qr);
          this.botStatus = "waiting_for_qr_scan";
          console.log("📱 كود QR جاهز للمسح");
        } catch (err) {
          console.error("خطأ في إنشاء كود QR:", err);
        }
      });

      this.client.on("ready", () => {
        console.log("✅ البوت جاهز ويعمل بنجاح");
        this.botStatus = "ready";
        this.qrCodeData = null;
      });

      this.client.on("disconnected", (reason) => {
        console.log("❌ تم قطع الاتصال:", reason);
        this.botStatus = "disconnected";
        this.qrCodeData = null;
      });

      this.client.on("auth_failure", () => {
        console.log("❌ فشل في المصادقة");
        this.botStatus = "auth_failed";
        this.qrCodeData = null;
      });

      this.client.on("message", async (msg) => {
        try {
          await this.handleMessage(msg);
        } catch (error) {
          console.error("خطأ في معالجة الرسالة:", error);
        }
      });

      await this.client.initialize();
    } catch (error) {
      console.error("خطأ في تهيئة العميل:", error);
      this.botStatus = "auth_failed";
      throw error;
    }
  }

  private async handleMessage(msg: any) {
    try {
      // Skip messages from groups or status updates
      if (msg.from.includes("@g.us") || msg.from.includes("status@broadcast")) {
        return;
      }

      // Skip messages sent by the bot
      if (msg.fromMe) {
        return;
      }

      const messageText = msg.body.trim();
      const customerPhone = msg.from.replace("@c.us", "");

      console.log(`📨 رسالة من ${customerPhone}: ${messageText}`);

      // Check if this is a rating (1-5)
      const rating = this.extractRating(messageText);

      if (rating !== null) {
        await this.handleRating(customerPhone, rating, messageText);
      } else {
        // Check if this is a follow-up reason for negative feedback
        await this.handleFollowUpReason(customerPhone, messageText);
      }
    } catch (error) {
      console.error("خطأ في معالجة الرسالة:", error);
    }
  }

  private extractRating(text: string): number | null {
    // Clean the text to work with
    const cleanText = text.trim().toLowerCase();

    // Look for explicit rating patterns like "تقييمي: 5" or "rating: 4"
    const explicitRating = cleanText.match(/(?:تقييمي?|rating|تقدير)\s*:?\s*([1-5])/);
    if (explicitRating) {
      return parseInt(explicitRating[1]);
    }

    // Look for star emojis first (more reliable)
    const stars = text.match(/⭐/g);
    if (stars && stars.length >= 1 && stars.length <= 5) {
      return stars.length;
    }

    // Look for standalone numbers 1-5 at the beginning or end of message
    const standaloneNumber = cleanText.match(/^([1-5])$|^([1-5])\s|([1-5])$/);
    if (standaloneNumber) {
      return parseInt(standaloneNumber[1] || standaloneNumber[2] || standaloneNumber[3]);
    }

    // Look for Arabic numbers
    const arabicNums: { [key: string]: number } = {
      'واحد': 1, 'اثنان': 2, 'اثنين': 2, 'ثلاثة': 3, 'أربعة': 4, 'خمسة': 5,
      'واحده': 1, 'اتنان': 2, 'اتنين': 2, 'تلاتة': 3, 'اربعة': 4, 'خمسه': 5
    };

    for (const [word, rating] of Object.entries(arabicNums)) {
      if (cleanText.includes(word)) {
        return rating;
      }
    }

    return null;
  }

  private async handleRating(
    customerPhone: string,
    rating: number,
    originalMessage: string,
  ) {
    try {
      let customer;
      let feedback;

      if (!this.isMongoAvailable()) {
        // Use mock storage
        customer = mockStorage.findCustomerByPhone(customerPhone);
        if (!customer) {
          customer = mockStorage.upsertCustomer({
            phone: customerPhone,
            name: `عميل ${customerPhone.slice(-4)}`,
          });
        }

        feedback = mockStorage.addFeedback({
          customerId: customer._id!,
          customerPhone: customerPhone,
          customerName: customer.name,
          rating: rating,
          source: "whatsapp",
          status: "pending",
        });
      } else {
        // Use MongoDB
        customer = await CustomerModel.findOne({ phone: customerPhone });
        if (!customer) {
          customer = await CustomerModel.create({
            phone: customerPhone,
            name: `عميل ${customerPhone.slice(-4)}`,
          });
        }

        feedback = await FeedbackModel.create({
          customerId: customer._id!.toString(),
          customerPhone: customerPhone,
          customerName: customer.name,
          rating: rating,
          source: "whatsapp",
          status: "pending",
        });
      }

      console.log(`💫 تم حفظ التقييم: ${rating}/5 من ${customerPhone}`);

      // Send appropriate response
      if (rating >= 4) {
        // Positive feedback - ask for Google Maps review
        let googleMapsLink = "https://maps.google.com/your-business-location";

        try {
          // Get Google Maps link from settings
          if (this.isMongoAvailable()) {
            const { SettingsModel } = await import("../models/index.js");
            const settings = await SettingsModel.findOne();
            if (settings?.googleMapsLink) {
              googleMapsLink = settings.googleMapsLink;
            }
          } else {
            const { mockStorage } = await import("./mockStorage.js");
            const settings = mockStorage.getSettings();
            if (settings.googleMapsLink) {
              googleMapsLink = settings.googleMapsLink;
            }
          }
        } catch (error) {
          console.error("Error getting Google Maps link:", error);
        }

        const response = `شكرًا لتقييمك الرائع! 🌟
هل يمكنك ترك تقييم عام على Google Maps؟
${googleMapsLink}
نقدر وقتك وثقتك بنا! ❤️`;

        await this.sendMessage(customerPhone, response);

        // Mark as processed
        if (!this.isMongoAvailable()) {
          mockStorage.updateFeedbackStatus(feedback._id!, "processed");
        } else {
          feedback.status = "processed";
          await (feedback as any).save();
        }
      } else {
        // Negative feedback - ask for reason
        const response = `شكرًا لصراحتك 🙏
يهمنا نعرف سبب عدم رضاك عن الخدمة.
ممكن توضح لنا إيه اللي مش عاجبك عشان نحسن خدمتنا؟`;

        await this.sendMessage(customerPhone, response);
        // Keep status as pending until we get the reason
      }
    } catch (error) {
      console.error("خطأ في معالجة التقييم:", error);
    }
  }

  private async handleFollowUpReason(customerPhone: string, reason: string) {
    try {
      let pendingFeedback;

      if (!this.isMongoAvailable()) {
        // Use mock storage
        const allFeedback = mockStorage.getFeedback();
        pendingFeedback = allFeedback
          .filter(
            (f) =>
              f.customerPhone === customerPhone &&
              f.status === "pending" &&
              f.rating < 4
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt!).getTime() -
              new Date(a.createdAt!).getTime()
          )[0];

        if (pendingFeedback) {
          const feedback = mockStorage
            .getFeedback()
            .find((f) => f._id === pendingFeedback!._id);
          if (feedback) {
            feedback.reason = reason;
            feedback.status = "processed";
          }
        }
      } else {
        // Find pending feedback for this customer
        pendingFeedback = await FeedbackModel.findOne({
          customerPhone: customerPhone,
          status: "pending",
          rating: { $lt: 4 },
        }).sort({ createdAt: -1 });

        if (pendingFeedback) {
          // Update with reason
          pendingFeedback.reason = reason;
          pendingFeedback.status = "processed";
          await pendingFeedback.save();
        }
      }

      if (pendingFeedback) {
        console.log(`📝 تم حفظ سبب عدم الرضا من ${customerPhone}: ${reason}`);

        // Send thank you message
        const response = `شكرًا لك على توضيح الأمر 🙏
ملاحظاتك مهمة جداً لنا وهنعمل على تحسين هذه النقاط.
نتطلع لخدمتك أفضل في المرة القادمة! ❤️`;

        await this.sendMessage(customerPhone, response);
      }
    } catch (error) {
      console.error("خطأ في معالجة سبب عدم الرضا:", error);
    }
  }

  async sendMessage(to: string, message: string): Promise<boolean> {
    try {
      if (!this.client || this.botStatus !== "ready") {
        throw new Error("WhatsApp client is not ready");
      }

      const chatId = to.includes("@c.us") ? to : `${to}@c.us`;
      await this.client.sendMessage(chatId, message);

      console.log(`✅ تم إرسال رسالة إلى ${to}`);
      return true;
    } catch (error) {
      console.error(`❌ فشل إرسال رسالة إلى ${to}:`, error);
      return false;
    }
  }

  async sendBulkMessages(
    customers: Array<{ phone: string; name?: string }>,
  ): Promise<{ sent: number; failed: number; errors: string[] }> {
    const results = { sent: 0, failed: 0, errors: [] as string[] };

    if (!this.client || this.botStatus !== "ready") {
      results.errors.push("WhatsApp client is not ready");
      return results;
    }

    const message = `مرحبًا 👋

  إحنا سعداء جدًا إنك شرفتنا النهارده في فرعنا ❤️

  📊 *يهمنا نعرف رأيك في زيارتك!*

  *اختر من التقييمات التالية بالرد على الرسالة:*

   *1* - سيء جدًا
   *2* - سيء
   *3* - مقبول
   *4* - جيد
   *5* - ممتاز

  من فضلك اكتب تقييمك (١ إلى ٥) عشان نقدر نساعدك بشكل أفضل في المستقبل! 🙏`;

    for (const customer of customers) {
      try {
        const success = await this.sendMessage(customer.phone, message);
        if (success) {
          results.sent++;
          // Add small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          results.failed++;
          results.errors.push(`Failed to send to ${customer.phone}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Error sending to ${customer.phone}: ${error}`);
      }
    }

    return results;
  }

  getStatus() {
    return {
      status: this.botStatus,
      qrCode: this.qrCodeData,
      message: this.getStatusMessage(),
    };
  }

  private getStatusMessage(): string {
    switch (this.botStatus) {
      case "not_initialized":
        return "لم يتم تهيئة WhatsApp بعد";
      case "initializing":
        return "جاري تهيئة WhatsApp...";
      case "waiting_for_qr_scan":
        return "امسح كود QR بهاتفك";
      case "ready":
        return "WhatsApp جاهز للاستخدام";
      case "disconnected":
        return "تم قطع اتصال WhatsApp";
      case "auth_failed":
        return "فشل في المصادقة";
      default:
        return "حالة غير معروفة";
    }
  }

  async disconnect() {
    this.stopAutoRefresh();
    if (this.client) {
      await this.client.destroy();
      this.client = null;
      this.botStatus = "disconnected";
      this.qrCodeData = null;
    }
  }

  async restart() {
    this.botStatus = "restarting";
    await this.disconnect();
    this.clearAuthData();
    this.initialized = false;
    await this.initialize();
  }

  async resetAuthentication() {
    console.log("🔄 Resetting WhatsApp authentication...");
    this.stopAutoRefresh();

    // Disconnect current session
    if (this.client) {
      try {
        await this.client.destroy();
      } catch (error) {
        console.error("Error destroying client during reset:", error);
      }
      this.client = null;
    }

    // Clear authentication data
    this.clearAuthData();

    // Reset states
    this.botStatus = "not_initialized";
    this.qrCodeData = null;
    this.initialized = false;

    // Initialize fresh connection
    await this.initialize();

    console.log("✅ Authentication reset complete - ready for new QR scan");
  }
}

export const whatsappService = new WhatsAppService();