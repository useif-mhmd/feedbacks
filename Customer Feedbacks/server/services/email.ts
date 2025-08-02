import nodemailer from "nodemailer";
import { SettingsModel } from "../models/index.js";

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
    const transporter = nodemailer.createTransport({
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

      // Get settings for this user
      const settings = await SettingsModel.findOne({ userId });
      const googleMapsLink = settings?.googleMapsLink || "https://maps.google.com/your-business-location";
      const fromEmail = settings?.smtpConfig.email || 'info@mshareb.com';

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
            .rating-star {
              font-size: 40px;
              color: #fbbf24;
              margin: 0 5px;
              cursor: pointer;
              text-decoration: none;
            }
            .rating-star:hover {
              color: #f59e0b;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 14px;
              margin-top: 30px;
            }
            .google-maps-note {
              background: linear-gradient(135deg, #e0f2fe, #f0f9ff);
              border: 1px solid #0284c7;
              border-radius: 10px;
              padding: 15px;
              margin: 20px 0;
              text-align: center;
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
              <h2>من فضلك قيّم زيارتك:</h2>
              <div style="margin: 20px 0;">
                <a href="mailto:${fromEmail}?subject=تقييم الخدمة - 1 نجمة" class="rating-star">⭐️</a>
                <a href="mailto:${fromEmail}?subject=تقييم الخدمة - 2 ن��مة" class="rating-star">⭐️</a>
                <a href="mailto:${fromEmail}?subject=تقييم الخدمة - 3 نجمة" class="rating-star">⭐️</a>
                <a href="mailto:${fromEmail}?subject=تقييم الخدمة - 4 نجمة" class="rating-star">⭐️</a>
                <a href="mailto:${fromEmail}?subject=تقييم الخدمة - 5 نجمة" class="rating-star">⭐️</a>
              </div>
              <p style="color: #6b7280;">اضغط على عدد النجوم التي تعبر عن تقييمك</p>
            </div>

            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>أو يمكنك الرد على هذا الإيميل مباشرة برقم من 1 إلى 5:</strong></p>
              <ul style="margin: 10px 0;">
                <li>1 = غير راضي تماماً</li>
                <li>2 = غير راضي</li>
                <li>3 = محايد</li>
                <li>4 = راضي</li>
                <li>5 = راضي جداً</li>
              </ul>
            </div>

            <div class="google-maps-note">
              <p style="color: #0369a1; font-weight: bold; margin: 5px 0;">
                💡 إذا كان تقييمك إيجابياً (4-5 ن��وم)
              </p>
              <p style="color: #0c4a6e; font-size: 14px;">
                سنطلب منك ترك تقييم على Google Maps لمساعدة عملاء آخرين!
              </p>
            </div>

            <div class="footer">
              <p>شكراً لوقتك الثمين! 🌟</p>
              <p>فريق خدمة العملاء</p>
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
      console.log(`✅ تم إرسال إيميل إلى ${to}`);
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
