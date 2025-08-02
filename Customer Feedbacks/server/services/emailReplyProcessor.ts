import {
  FeedbackModel,
  CustomerModel,
  SettingsModel,
} from "../models/index.js";
import { mockStorage } from "./mockStorage.js";
import mongoose from "mongoose";
import { emailService } from "./email.js";
import crypto from "crypto";

class EmailReplyProcessor {
  private isMongoAvailable(): boolean {
    return mongoose.connection.readyState === 1;
  }

  async processEmailReply(
    fromEmail: string,
    subject: string,
    body: string,
    messageId?: string,
    inReplyTo?: string,
    references?: string
  ) {
    try {
      console.log(`📧 Processing email reply from: ${fromEmail}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${body}`);
      console.log(`Threading - MessageId: ${messageId}, InReplyTo: ${inReplyTo}`);

      // العثور على userId بناءً على fromEmail
      const userId = await this.findUserIdByEmail(fromEmail);
      if (!userId) {
        console.log(`❌ No user found for email: ${fromEmail}`);
        return;
      }

      // Extract rating from subject or body
      const rating = this.extractRatingFromEmail(subject, body);

      if (rating !== null) {
        await this.handleEmailRating(fromEmail, rating, body, userId, messageId, inReplyTo, references);
      } else {
        // Check if this is a follow-up reason for negative feedback
        await this.handleEmailFollowUpReason(fromEmail, body, userId, messageId, inReplyTo, references);
      }
    } catch (error) {
      console.error("Error processing email reply:", error);
    }
  }

  // دالة للعثور على userId بناءً على email العميل
  private async findUserIdByEmail(customerEmail: string): Promise<string | null> {
    try {
      if (this.isMongoAvailable()) {
        // البحث في قاعدة البيانات عن العميل
        const customer = await CustomerModel.findOne({ email: customerEmail });
        if (customer?.userId) {
          return customer.userId;
        }

        // إذا لم نجد عميل، نبحث في إعدادات SMTP (إذا كان الإيميل من شركة معينة)
        const settings = await SettingsModel.findOne({ 'smtpConfig.email': customerEmail });
        if (settings?.userId) {
          return settings.userId;
        }

        // كبديل، يمكن البحث بناءً على domain
        const emailDomain = customerEmail.split('@')[1];
        const settingsByDomain = await SettingsModel.findOne({
          'smtpConfig.email': { $regex: `@${emailDomain}$` }
        });
        if (settingsByDomain?.userId) {
          return settingsByDomain.userId;
        }
      } else {
        // استخدام mock storage
        const allCustomers = mockStorage.getCustomers();
        for (const customer of allCustomers) {
          if (customer.email === customerEmail) {
            return customer.userId;
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error finding userId by email:', error);
      return null;
    }
  }

  private extractRatingFromEmail(subject: string, body: string): number | null {
    // Look for rating in subject (تقييم الخدمة - 5 نجمة)
    const subjectMatch = subject.match(/تقييم.+?(\d+)/);
    if (subjectMatch) {
      const rating = parseInt(subjectMatch[1]);
      if (rating >= 1 && rating <= 5) {
        return rating;
      }
    }

    // Look for rating in body
    const bodyMatch = body.match(/[1-5]/);
    if (bodyMatch) {
      const rating = parseInt(bodyMatch[0]);
      if (rating >= 1 && rating <= 5) {
        return rating;
      }
    }

    // Look for star emojis
    const stars = body.match(/⭐/g);
    if (stars && stars.length >= 1 && stars.length <= 5) {
      return stars.length;
    }

    return null;
  }

  private async handleEmailRating(
    email: string,
    rating: number,
    originalMessage: string,
    userId: string,
    messageId?: string,
    inReplyTo?: string,
    references?: string
  ) {
    try {
      let customer;
      let feedback;

      if (!this.isMongoAvailable()) {
        // Use mock storage
        customer = mockStorage.getCustomers().find((c) => c.email === email && c.userId === userId);
        if (!customer) {
          customer = mockStorage.upsertCustomer({
            phone: `email_${Date.now()}`,
            email: email,
            name: `عميل ${email.split("@")[0]}`,
            userId: userId,
          });
        }

        feedback = mockStorage.addFeedback({
          userId: userId,
          customerId: customer._id!,
          customerPhone: customer.phone,
          customerName: customer.name,
          rating: rating,
          source: "email",
          status: "pending",
        });
      } else {
        // Use MongoDB
        customer = await CustomerModel.findOne({ email: email, userId: userId });
        if (!customer) {
          customer = await CustomerModel.create({
            userId: userId,
            phone: `email_${Date.now()}`,
            email: email,
            name: `عميل ${email.split("@")[0]}`,
          });
        }

        feedback = await FeedbackModel.create({
          userId: userId,
          customerId: customer._id!.toString(),
          customerPhone: customer.phone,
          customerName: customer.name,
          rating: rating,
          source: "email",
          status: "pending",
        });
      }

      console.log(`💫 تم حفظ التقييم عبر الإيميل: ${rating}/5 من ${email}`);

      // Generate threading IDs for proper email conversation
      const threadId = messageId || `feedback-${customer._id}-${Date.now()}`;
      const replyReferences = references ? `${references} ${inReplyTo || threadId}` : (inReplyTo || threadId);

      // Send appropriate response
      if (rating >= 4) {
        await this.sendPositiveFeedbackEmail(email, userId, customer.name, threadId, threadId, replyReferences);

        // Mark as processed
        if (!this.isMongoAvailable()) {
          mockStorage.updateFeedbackStatus(feedback._id!, "processed");
        } else {
          feedback.status = "processed";
          await (feedback as any).save();
        }
      } else {
        await this.sendNegativeFeedbackEmail(email, userId, customer.name, threadId, threadId, replyReferences);
        // Keep status as pending until we get the reason
      }
    } catch (error) {
      console.error("خطأ في معالجة تقييم الإيم��ل:", error);
    }
  }

  private async sendPositiveFeedbackEmail(
    toEmail: string,
    userId: string,
    customerName?: string,
    messageId?: string,
    inReplyTo?: string,
    references?: string
  ) {
    try {
      // Get Google Maps link from settings
      let googleMapsLink = "https://maps.google.com/your-business-location";

      try {
        if (this.isMongoAvailable()) {
          const settings = await SettingsModel.findOne({ userId });
          if (settings?.googleMapsLink) {
            googleMapsLink = settings.googleMapsLink;
          }
        } else {
          const settings = mockStorage.getSettings();
          if (settings.googleMapsLink) {
            googleMapsLink = settings.googleMapsLink;
          }
        }
      } catch (error) {
        console.error("Error getting Google Maps link:", error);
      }

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
                هل يمكنك مشاركة تجربتك الرائعة معنا على Google Maps��
              </p>
              
              <a href="${googleMapsLink}" class="google-maps-btn">
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

      const settings = this.isMongoAvailable()
        ? await SettingsModel.findOne({ userId })
        : mockStorage.getSettings();

      if (settings?.smtpConfig.email) {
        await emailService.sendCustomEmail(
          toEmail,
          userId,
          "Re: 🌟 شكراً لتقييمك الإيجابي!",
          htmlContent,
          messageId,
          inReplyTo,
          references
        );
        console.log(`✅ تم إرسال رد إيجابي لـ ${toEmail}`);
      }
    } catch (error) {
      console.error("خطأ في إرسال رد إيجابي:", error);
    }
  }

  private async sendNegativeFeedbackEmail(
    toEmail: string,
    userId: string,
    customerName?: string,
    messageId?: string,
    inReplyTo?: string,
    references?: string
  ) {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>نود معرفة رأيك</title>
          <style>
            body {
              font-family: 'Cairo', 'Tajawal', Arial, sans-serif;
              direction: rtl;
              text-align: right;
              background-color: #fef2f2;
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
              border-top: 4px solid #ef4444;
            }
            .header {
              text-align: center;
              color: #dc2626;
              margin-bottom: 30px;
            }
            .feedback-form {
              background-color: #fef2f2;
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🙏 شكراً لصراحتك</h1>
              <p>${customerName ? `عزيزي ${customerName}` : "عزيزنا الع��يل"}</p>
            </div>
            
            <div class="feedback-form">
              <h3>يهمنا نعرف رأيك 💭</h3>
              <p>
                نعتذر إذا لم تكن تجربتك معنا مثالية.
                <br>
                من فضلك أخبرنا عن سبب عدم رضاك عن الخدمة حتى نتمكن من التحسين.
              </p>
              
              <p style="background-color: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <strong>للر��:</strong> ببساطة اضغط "رد" على هذا الإيميل واكتب ملاحظاتك
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #6b7280;">
              <p>نتطلع لسماع آرائكم لتحسين خدماتنا ❤️</p>
              <p>فريق خدمة العملاء</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const settings = this.isMongoAvailable()
        ? await SettingsModel.findOne({ userId })
        : mockStorage.getSettings();

      if (settings?.smtpConfig.email) {
        await emailService.sendCustomEmail(
          toEmail,
          userId,
          "Re: 💭 نود معرفة رأيك - كيف يمكنن�� التحسين؟",
          htmlContent,
          messageId,
          inReplyTo,
          references
        );
        console.log(`✅ تم إرسال طلب توضيح لـ ${toEmail}`);
      }
    } catch (error) {
      console.error("خطأ في إرسال طلب توضيح:", error);
    }
  }

  private async handleEmailFollowUpReason(
    email: string,
    reason: string,
    userId: string,
    messageId?: string,
    inReplyTo?: string,
    references?: string
  ) {
    try {
      let pendingFeedback;

      if (!this.isMongoAvailable()) {
        // Use mock storage
        const allFeedback = mockStorage.getFeedback();
        const customer = mockStorage
          .getCustomers()
          .find((c) => c.email === email);

        if (customer) {
          pendingFeedback = allFeedback
            .filter(
              (f) =>
                f.customerId === customer._id &&
                f.status === "pending" &&
                f.rating < 4,
            )
            .sort(
              (a, b) =>
                new Date(b.createdAt!).getTime() -
                new Date(a.createdAt!).getTime(),
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
        }
      } else {
        // Find customer by email
        const customer = await CustomerModel.findOne({ email: email });

        if (customer) {
          // Find pending feedback for this customer
          pendingFeedback = await FeedbackModel.findOne({
            customerId: customer._id,
            status: "pending",
            rating: { $lt: 4 },
          }).sort({ createdAt: -1 });

          if (pendingFeedback) {
            pendingFeedback.reason = reason;
            pendingFeedback.status = "processed";
            await pendingFeedback.save();
          }
        }
      }

      if (pendingFeedback) {
        console.log(`📝 تم حفظ سبب عدم الرضا من ${email}: ${reason}`);
        const threadId = messageId || `feedback-followup-${Date.now()}`;
        const replyReferences = references ? `${references} ${inReplyTo || threadId}` : (inReplyTo || threadId);
        await this.sendThankYouEmail(email, userId, threadId, threadId, replyReferences);
      }
    } catch (error) {
      console.error("خطأ في معالجة سبب عدم الرضا:", error);
    }
  }

  private async sendThankYouEmail(
    toEmail: string,
    userId: string,
    messageId?: string,
    inReplyTo?: string,
    references?: string
  ) {
    try {
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
              <h1>🙏 شكراً لتوضيحك</h1>
            </div>
            
            <p style="font-size: 18px; color: #374151; line-height: 1.6;">
              نشكرك على أخذ الوقت لتوضيح ملاحظاتك.
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

      const settings = this.isMongoAvailable()
        ? await SettingsModel.findOne({ userId })
        : mockStorage.getSettings();

      if (settings?.smtpConfig.email) {
        await emailService.sendCustomEmail(
          toEmail,
          userId,
          "Re: 🙏 شكراً لملاحظاتك القيمة",
          htmlContent,
          messageId,
          inReplyTo,
          references
        );
        console.log(`✅ تم إرسال رسالة شكر لـ ${toEmail}`);
      }
    } catch (error) {
      console.error("خطأ في إرسال رسالة الشكر:", error);
    }
  }
}

export const emailReplyProcessor = new EmailReplyProcessor();
