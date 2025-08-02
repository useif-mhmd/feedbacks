import nodemailer from "nodemailer";
import { SettingsModel, CustomerModel } from "../models/index.js";
import { generateRatingToken } from "../routes/rating.js";
import { mockStorage } from "./mockStorage.js";
import mongoose from "mongoose";

class EmailService {
  private transporters: Map<string, nodemailer.Transporter> = new Map();

  async getTransporter(userId: string): Promise<nodemailer.Transporter> {
    // التحقق من وجود transporter مخزن لهذا المستخدم
    if (this.transporters.has(userId)) {
      return this.transporters.get(userId)!;
    }

    // جلب إعدادات SMTP للمستخدم
    const settings = await SettingsModel.findOne({ userId });
    if (!settings || !settings.smtpConfig.email || !settings.smtpConfig.password) {
      throw new Error(`SMTP configuration not found for user ${userId}`);
    }

    const { email, password, host, port } = settings.smtpConfig;

    // إنشاء transporter جديد للمستخدم
    const transporter = nodemailer.createTransporter({
      host: host || 'smtp.hostinger.com',
      port: port || 587,
      secure: false,
      auth: {
        user: email,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // التحقق من صحة الاتصال
    try {
      await transporter.verify();
      console.log(`✅ SMTP connection verified for user ${userId}`);
      
      // حفظ transporter في الذاكرة للاستخدام المستقبلي
      this.transporters.set(userId, transporter);
      
      return transporter;
    } catch (error) {
      console.error(`❌ SMTP verification failed for user ${userId}:`, error);
      throw error;
    }
  }

  // حذف transporter من الذاكرة عند تحديث الإعدادات
  invalidateTransporter(userId: string): void {
    if (this.transporters.has(userId)) {
      this.transporters.delete(userId);
      console.log(`🔄 Transporter cache invalidated for user ${userId}`);
    }
  }

  async sendFeedbackEmail(to: string, userId: string, customerName?: string): Promise<boolean> {
    try {
      const transporter = await this.getTransporter(userId);
      const isMongoAvailable = () => mongoose.connection.readyState === 1;

      // Get or create customer
      let customer;
      if (isMongoAvailable()) {
        customer = await CustomerModel.findOne({ email: to, userId });
        if (!customer) {
          customer = await CustomerModel.create({
            userId,
            email: to,
            name: customerName || `عميل ${to.split("@")[0]}`,
            phone: `email_${Date.now()}`,
          });
        }
      } else {
        customer = mockStorage.getCustomers().find(c => c.email === to && c.userId === userId);
        if (!customer) {
          customer = mockStorage.upsertCustomer({
            userId,
            email: to,
            name: customerName || `عميل ${to.split("@")[0]}`,
            phone: `email_${Date.now()}`,
          });
        }
      }

      // Generate rating token
      const ratingToken = generateRatingToken(
        userId,
        customer._id!.toString(),
        to,
        customerName,
        customer.phone
      );

      // Get settings for this user
      const settings = isMongoAvailable() ? 
        await SettingsModel.findOne({ userId }) : 
        mockStorage.getSettings();
      
      const fromEmail = settings?.smtpConfig?.email || 'info@mshareb.com';
      
      // Get current domain for rating link
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL || 'https://your-domain.com'
        : 'http://localhost:8080';
      
      const ratingUrl = `${baseUrl}/rate/${ratingToken}`;

      const htmlContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تقييم الخدمة</title>
          <style>
            body {
              font-family: 'Cairo', 'Tajawal', Arial, sans-serif;
              direction: rtl;
              text-align: right;
              background-color: #f5f5f5;
              margin: 0;
              padding: 20px;
            }
            .container {
              background-color: white;
              max-width: 600px;
              margin: 0 auto;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              color: #2563eb;
              margin-bottom: 30px;
            }
            .rating-container {
              text-align: center;
              margin: 30px 0;
            }
            .rating-btn {
              background: linear-gradient(135deg, #2563eb, #1d4ed8);
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
            .rating-btn:hover {
              transform: translateY(-2px);
              color: white;
              text-decoration: none;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 14px;
              margin-top: 30px;
            }
            .stars-demo {
              font-size: 30px;
              margin: 15px 0;
              color: #fbbf24;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🙏 أهلاً بك${customerName ? ` ${customerName}` : ""}!</h1>
              <p>سعداء جداً إنك زرت فرعنا النهارده ❤️</p>
            </div>

            <div class="rating-container">
              <h2>من فضلك قيّم تجربتك معنا:</h2>
              <div class="stars-demo">
                ⭐️ ⭐️ ⭐️ ⭐️ ⭐️
              </div>
              
              <a href="${ratingUrl}" class="rating-btn">
                🌟 اضغط هنا للتقييم
              </a>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 15px;">
                الرابط صالح لمدة 7 أيام من تاريخ الإرسال
              </p>
            </div>

            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #0284c7;">
              <p style="color: #0369a1; font-weight: bold; margin: 5px 0;">
                💡 لماذا نطلب تقييمك؟
              </p>
              <ul style="color: #0c4a6e; font-size: 14px; margin: 10px 0;">
                <li>لتحسين جودة خدماتنا</li>
                <li>لمعرفة آرائكم وملاحظاتكم</li>
                <li>لمساعدة عملاء آخرين في اختيار خدماتنا</li>
              </ul>
            </div>

            <div class="footer">
              <p>شكراً لوقتك الثمين! 🌟</p>
              <p>فريق خدمة العملاء</p>
              <p style="font-size: 12px; color: #9ca3af; margin-top: 10px;">
                إذا كنت تواجه مشكلة في الرابط، يمكنك الرد على هذا الإيميل برقم من 1 إلى 5
              </p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: fromEmail,
        to: to,
        subject: "🌟 شاركنا تقييمك لزيارتك",
        html: htmlContent,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ تم إرسال إيميل إلى ${to} مع رابط التقييم`);
      return true;
    } catch (error) {
      console.error(`❌ فشل إرسال إيميل إلى ${to}:`, error);
      return false;
    }
  }

  async sendBulkEmails(
    customers: Array<{ email: string; name?: string; phone?: string }>,
    userId: string
  ): Promise<{ sent: number; failed: number; errors: string[] }> {
    const results = { sent: 0, failed: 0, errors: [] as string[] };

    for (const customer of customers) {
      if (!customer.email) {
        results.failed++;
        results.errors.push(
          `No email provided for customer ${customer.name || "unknown"}`,
        );
        continue;
      }

      try {
        const success = await this.sendFeedbackEmail(
          customer.email,
          userId,
          customer.name
        );
        if (success) {
          results.sent++;
        } else {
          results.failed++;
          results.errors.push(`Failed to send to ${customer.email}`);
        }

        // Add small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        results.failed++;
        results.errors.push(`Error sending to ${customer.email}: ${error}`);
      }
    }

    return results;
  }

  async sendCustomEmail(
    to: string,
    userId: string,
    subject: string,
    htmlContent: string,
    messageId?: string,
    inReplyTo?: string,
    references?: string
  ): Promise<boolean> {
    try {
      const transporter = await this.getTransporter(userId);
      const settings = await SettingsModel.findOne({ userId });

      const mailOptions: any = {
        from: settings?.smtpConfig.email,
        to: to,
        subject: subject,
        html: htmlContent,
      };

      // Add threading headers if provided
      if (messageId) {
        mailOptions.messageId = messageId;
      }
      if (inReplyTo) {
        mailOptions.inReplyTo = inReplyTo;
      }
      if (references) {
        mailOptions.references = references;
      }

      await transporter.sendMail(mailOptions);
      console.log(`✅ تم إرسال إيميل مخصص إلى ${to}`);
      return true;
    } catch (error) {
      console.error(`❌ فشل إرسال إيميل مخصص إلى ${to}:`, error);
      return false;
    }
  }
}

export const emailService = new EmailService();
