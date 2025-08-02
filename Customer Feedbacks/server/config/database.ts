import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/feedback-automation";

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log(`✅ MongoDB متصل: ${conn.connection.host}`);
  } catch (error) {
    console.warn(
      "⚠️ تحذير: لا يمكن الاتصال بقاعدة البيانات، سيتم تشغيل التطبيق بدون قاعدة بيانات",
    );
    console.warn(
      "لتفعيل قاعدة البيانات، تأكد من تشغيل MongoDB أو استخدم MongoDB Atlas",
    );
    // Don't exit the process, just continue without DB
  }
};

export default connectDB;
