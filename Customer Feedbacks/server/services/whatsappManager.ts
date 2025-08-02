import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import * as qrcode from "qrcode";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { BotStatus } from "../../shared/types.js";
import { FeedbackModel, CustomerModel } from "../models/index.js";

// Per-user WhatsApp client instance
class UserWhatsAppClient {
  private client: Client | null = null;
  private qrCodeData: string | null = null;
  private botStatus: BotStatus = "not_initialized";
  private initialized = false;
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  // Helper to check if MongoDB is available
  private isMongoAvailable(): boolean {
    return mongoose.connection.readyState === 1;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      this.botStatus = "initializing";
      await this.initializeClient();
      this.initialized = true;
    } catch (error) {
      console.error(`Failed to initialize WhatsApp for user ${this.userId}:`, error);
      this.botStatus = "auth_failed";
      throw error;
    }
  }

  async resetAuth() {
    try {
      // Destroy current client
      if (this.client) {
        await this.client.destroy();
        this.client = null;
      }

      // Clear auth data for this user
      this.clearAuthData();

      // Reset status
      this.botStatus = "not_initialized";
      this.initialized = false;
      this.qrCodeData = null;

      console.log(`✅ تم إعادة تعيين مصادقة WhatsApp للمستخدم: ${this.userId}`);
    } catch (error) {
      console.error(`خطأ في إعادة تعيين مصادقة WhatsApp للمستخدم ${this.userId}:`, error);
      throw error;
    }
  }

  private clearAuthData(): void {
    try {
      const sessionPath = path.join(process.cwd(), `.wwebjs_auth_${this.userId}`);
      if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
        console.log(`✅ تم حذف بيانات المصادقة للمستخدم: ${this.userId}`);
      }
    } catch (error) {
      console.error(`خطأ في حذف بيانات المصادقة للمستخدم ${this.userId}:`, error);
    }
  }

  private async initializeClient(): Promise<void> {
    try {
      this.client = new Client({
        authStrategy: new LocalAuth({
          clientId: this.userId, // Use userId as clientId for separation
          dataPath: path.join(process.cwd(), `.wwebjs_auth_${this.userId}`)
        }),
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

      this.setupEventHandlers();
      await this.client.initialize();
    } catch (error) {
      console.error(`خط�� في إنشاء عميل WhatsApp للمستخدم ${this.userId}:`, error);
      throw error;
    }
  }

  private setupEventHandlers(): void {
    if (!this.client) return;

    this.client.on("qr", async (qr) => {
      console.log(`📱 QR كود تم إنشاؤه للمستخدم ${this.userId}`);
      this.botStatus = "waiting_for_qr_scan";
      try {
        this.qrCodeData = await qrcode.toDataURL(qr);
      } catch (error) {
        console.error(`خطأ في إنشاء QR كود للمستخدم ${this.userId}:`, error);
      }
    });

    this.client.on("ready", () => {
      console.log(`✅ WhatsApp متصل وجاهز للمستخدم ${this.userId}!`);
      this.botStatus = "ready";
      this.qrCodeData = null;
    });

    this.client.on("authenticated", () => {
      console.log(`🔐 تم التوثيق بنجاح للمستخدم ${this.userId}`);
    });

    this.client.on("auth_failure", (message) => {
      console.error(`❌ فشل التوثيق للمستخدم ${this.userId}:`, message);
      this.botStatus = "auth_failed";
    });

    this.client.on("disconnected", (reason) => {
      console.log(`⚠️ تم قطع الاتصال للمستخدم ${this.userId}:`, reason);
      this.botStatus = "disconnected";
    });

    // Handle incoming messages for feedback
    this.client.on("message", async (message) => {
      try {
        await this.handleIncomingMessage(message);
      } catch (error) {
        console.error(`خطأ في معالجة الرسالة للمستخدم ${this.userId}:`, error);
      }
    });
  }

  private async handleIncomingMessage(message: any) {
    try {
      const fromNumber = message.from.replace(/\D/g, "");
      const messageText = message.body.trim().toLowerCase();

      // Skip group messages and status updates
      if (message.from.includes("@g.us") || message.from.includes("status@broadcast")) {
        return;
      }

      // Check if this is a rating response (1-5 or star emojis)
      const ratingMatch = messageText.match(/^([1-5]|[⭐️]{1,5})$/);
      if (ratingMatch) {
        let rating: number;

        if (ratingMatch[1].includes("⭐")) {
          rating = ratingMatch[1].length;
        } else {
          rating = parseInt(ratingMatch[1]);
        }

        await this.processRating(fromNumber, rating, message);
      } else {
        // Check if this is a follow-up reason for negative feedback
        await this.processFollowUpReason(fromNumber, message.body.trim());
      }
    } catch (error) {
      console.error(`خطأ في معالجة الرسالة الواردة للمستخدم ${this.userId}:`, error);
    }
  }

  private async processRating(phoneNumber: string, rating: number, originalMessage: any) {
    try {
      // Find customer for this user
      const customer = await CustomerModel.findOne({ 
        phone: phoneNumber, 
        userId: this.userId 
      });

      if (!customer) {
        console.log(`لم يتم العثور على العميل ${phoneNumber} للمستخدم ${this.userId}`);
        return;
      }

      // Save feedback
      const feedback = await FeedbackModel.create({
        userId: this.userId,
        customerId: customer._id!.toString(),
        customerPhone: phoneNumber,
        customerName: customer.name,
        rating,
        source: "whatsapp",
        status: "pending",
      });

      console.log(`📊 تم حفظ تقييم ${rating}/5 من ${phoneNumber} للمستخدم ${this.userId}`);

      // Send appropriate response
      if (rating >= 4) {
        await this.sendPositiveFeedbackResponse(phoneNumber);
      } else {
        await this.sendNegativeFeedbackResponse(phoneNumber, feedback._id!.toString());
      }
    } catch (error) {
      console.error(`خطأ في معالجة التقييم للمستخدم ${this.userId}:`, error);
    }
  }

  private async sendPositiveFeedbackResponse(phoneNumber: string) {
    try {
      // Get Google Maps link from settings
      let googleMapsLink = "https://maps.google.com/your-business-location";
      try {
        if (this.isMongoAvailable()) {
          const { SettingsModel } = await import("../models/index.js");
          const settings = await SettingsModel.findOne({ userId: this.userId });
          if (settings?.googleMapsLink) {
            googleMapsLink = settings.googleMapsLink;
          }
        }
      } catch (error) {
        console.error("Error getting Google Maps link:", error);
      }

      const thankYouMessage = `🌟 شكراً لك على تقييمك الممتاز! نحن سعداء لرضاك عن خدمتنا ❤️

هل يمكنك مساعدتنا بترك مراجعة على Google؟
👈 الرابط: ${googleMapsLink}

شكراً لك مرة أخرى! 🙏`;

      await this.sendMessage(phoneNumber, thankYouMessage);
    } catch (error) {
      console.error(`خطأ في إرسال رد التقييم الإيجابي للمستخدم ${this.userId}:`, error);
    }
  }

  private async sendNegativeFeedbackResponse(phoneNumber: string, feedbackId: string) {
    try {
      const followUpMessage = `نأسف لأن تجربتك لم تكن كما تتوق�� 😔

هل يمكنك إخبارنا بما حدث حتى نتمكن من تحسين خدمتنا؟
يرجى الرد على هذه الرسالة بالتفاصيل.

نحن نقدر ملاحظاتك ونسعى للتحسن دائماً 🙏`;

      await this.sendMessage(phoneNumber, followUpMessage);
    } catch (error) {
      console.error(`خطأ في إرسال رد التقييم السلبي للمستخدم ${this.userId}:`, error);
    }
  }

  private async processFollowUpReason(phoneNumber: string, reason: string) {
    try {
      // Find pending feedback for this customer and user
      const pendingFeedback = await FeedbackModel.findOne({
        customerPhone: phoneNumber,
        userId: this.userId,
        status: "pending",
        rating: { $lt: 4 }, // Only negative ratings
      }).sort({ createdAt: -1 });

      if (pendingFeedback) {
        // Update with reason and mark as processed
        pendingFeedback.reason = reason;
        pendingFeedback.status = "processed";
        await pendingFeedback.save();

        console.log(`📝 تم حفظ سبب عدم الرضا من ${phoneNumber} للمستخدم ${this.userId}: ${reason}`);

        // Send thank you message
        const thankYouMessage = `شكرًا لصراحتك 🙏
يهمنا نعرف سبب عدم رضاك عن الخدمة.
ممكن توضح لنا الأسباب وذلك لتحسين خدمتنا؟`;

        await this.sendMessage(phoneNumber, thankYouMessage);
      } else {
        console.log(`لم يتم العثور على تقييم سلبي معلق من ${phoneNumber} للمستخدم ${this.userId}`);
      }
    } catch (error) {
      console.error(`خطأ في معالجة سبب عدم الرضا من ${phoneNumber} للمستخدم ${this.userId}:`, error);
    }
  }

  async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    try {
      if (!this.client || this.botStatus !== "ready") {
        throw new Error("WhatsApp client is not ready");
      }

      const formattedNumber = phoneNumber.includes("@") 
        ? phoneNumber 
        : `${phoneNumber}@c.us`;

      await this.client.sendMessage(formattedNumber, message);
      console.log(`✅ تم إرسال رسالة للرقم ${phoneNumber} من المستخدم ${this.userId}`);
      return true;
    } catch (error) {
      console.error(`❌ فشل إرسال رسالة للرقم ${phoneNumber} من المستخدم ${this.userId}:`, error);
      return false;
    }
  }

  async sendBulkMessages(customers: Array<{ phone: string; name?: string }>): Promise<{
    sent: number;
    failed: number;
    errors: string[];
  }> {
    const result = { sent: 0, failed: 0, errors: [] as string[] };

    if (!this.client || this.botStatus !== "ready") {
      result.errors.push("WhatsApp client is not ready");
      result.failed = customers.length;
      return result;
    }

    const feedbackMessage = `مرحبًا 👋

  نحن سعداء جدًا بزيارتك لفرعنا ❤
  📊 يهمنا نعرف رأيك!
  اختر من التقييمات التالية بالرد على الرسالة:

   1 - ممتاز
   2 - جيد
   3 - مقبول
   4 - سيء
   5 - سيء جدًا
  يسعدنا لو قمت بالتقييم من (١ إلى ٥) عشان نقدر نساعدك بشكل أفضل في المستقبل! 🙏`;

    for (const customer of customers) {
      try {
        await this.sendMessage(customer.phone, feedbackMessage);
        result.sent++;
        
        // Small delay between messages
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        result.failed++;
        result.errors.push(`Failed to send to ${customer.phone}: ${error}`);
      }
    }

    return result;
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
        return "WhatsApp غير مهيأ. اضغط تهيئة للبدء.";
      case "initializing":
        return "جاري تهيئة WhatsApp...";
      case "waiting_for_qr_scan":
        return "امسح الكود بواتساب هاتفك";
      case "ready":
        return "متصل وجاهز لإرسال الرسائل";
      case "disconnected":
        return "منقطع. جاري المحاولة مرة أخرى...";
      case "auth_failed":
        return "فش�� التوثيق. اضغط إعادة تعيين وحاول مرة أخرى.";
      default:
        return "حالة غير معروفة";
    }
  }

  async destroy() {
    try {
      if (this.client) {
        await this.client.destroy();
        this.client = null;
      }
      this.initialized = false;
      this.botStatus = "not_initialized";
      console.log(`🗑️ تم تدمير عميل WhatsApp للمستخدم ${this.userId}`);
    } catch (error) {
      console.error(`خطأ في تدمير عميل WhatsApp للمستخدم ${this.userId}:`, error);
    }
  }
}

// Manager for all user WhatsApp clients
class WhatsAppManager {
  private static instance: WhatsAppManager;
  private userClients: Map<string, UserWhatsAppClient> = new Map();

  private constructor() {}

  static getInstance(): WhatsAppManager {
    if (!WhatsAppManager.instance) {
      WhatsAppManager.instance = new WhatsAppManager();
    }
    return WhatsAppManager.instance;
  }

  getUserClient(userId: string): UserWhatsAppClient {
    if (!this.userClients.has(userId)) {
      this.userClients.set(userId, new UserWhatsAppClient(userId));
    }
    return this.userClients.get(userId)!;
  }

  async destroyUserClient(userId: string) {
    const client = this.userClients.get(userId);
    if (client) {
      await client.destroy();
      this.userClients.delete(userId);
    }
  }

  // Clean up unused clients (optional)
  async cleanupInactiveClients() {
    for (const [userId, client] of this.userClients) {
      try {
        const status = client.getStatus();
        if (status.status === "disconnected" || status.status === "auth_failed") {
          await this.destroyUserClient(userId);
          console.log(`🧹 تم تنظيف عميل WhatsApp غير النشط للمستخدم: ${userId}`);
        }
      } catch (error) {
        console.error(`خطأ في تنظيف عميل WhatsApp للمستخدم ${userId}:`, error);
      }
    }
  }
}

export const whatsappManager = WhatsAppManager.getInstance();
export { UserWhatsAppClient };
