import { Router } from "express";
import { emailReplyProcessor } from "../services/emailReplyProcessor.js";

const router = Router();

// Webhook لاستقبال ردود الإيميلات من مقدمي الخدمة مثل SendGrid, Mailgun, أو SMTP servers
router.post("/webhook", async (req, res) => {
  try {
    console.log("📧 Received email webhook:", req.body);
    
    // تختلف بنية البيانات حسب مقدم الخدمة
    // هذا المثال يدعم التنسيق الع��م
    const {
      from,
      to,
      subject,
      text: body,
      messageId,
      inReplyTo,
      references
    } = req.body;

    if (!from || !body) {
      return res.status(400).json({ 
        error: "Missing required fields: from, body" 
      });
    }

    // معالجة الرد
    await emailReplyProcessor.processEmailReply(
      from,
      subject || "",
      body,
      messageId,
      inReplyTo,
      references
    );

    res.status(200).json({ 
      success: true, 
      message: "Email processed successfully" 
    });

  } catch (error) {
    console.error("خطأ في معالجة webhook:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Test endpoint لاختبار النظام يدوياً
router.post("/test-reply", async (req, res) => {
  try {
    const {
      fromEmail,
      subject = "Re: تقييم الخدمة",
      body,
      messageId,
      inReplyTo,
      references
    } = req.body;

    if (!fromEmail || !body) {
      return res.status(400).json({ 
        error: "fromEmail and body are required" 
      });
    }

    console.log(`🧪 Testing email reply from ${fromEmail}: "${body}"`);

    await emailReplyProcessor.processEmailReply(
      fromEmail,
      subject,
      body,
      messageId,
      inReplyTo,
      references
    );

    res.json({ 
      success: true, 
      message: `Email reply processed for ${fromEmail}` 
    });

  } catch (error) {
    console.error("خطأ في اختبار المعالجة:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

// SendGrid webhook format
router.post("/sendgrid", async (req, res) => {
  try {
    const events = Array.isArray(req.body) ? req.body : [req.body];
    
    for (const event of events) {
      if (event.event === "inbound") {
        const {
          from,
          to,
          subject,
          text,
          msg_id: messageId,
          in_reply_to: inReplyTo,
          references
        } = event;

        await emailReplyProcessor.processEmailReply(
          from,
          subject || "",
          text || "",
          messageId,
          inReplyTo,
          references
        );
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("خطأ في SendGrid webhook:", error);
    res.status(500).json({ error: "Processing failed" });
  }
});

// Mailgun webhook format  
router.post("/mailgun", async (req, res) => {
  try {
    const {
      sender: from,
      recipient: to,
      subject,
      "body-plain": body,
      "Message-Id": messageId,
      "In-Reply-To": inReplyTo,
      References: references
    } = req.body;

    await emailReplyProcessor.processEmailReply(
      from,
      subject || "",
      body || "",
      messageId,
      inReplyTo,
      references
    );

    res.status(200).send("OK");
  } catch (error) {
    console.error("خطأ في Mailgun webhook:", error);
    res.status(500).json({ error: "Processing failed" });
  }
});

export default router;
