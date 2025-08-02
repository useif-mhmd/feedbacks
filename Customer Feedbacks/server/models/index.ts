import mongoose from "mongoose";
import { User, Settings, Customer, Feedback } from "../../shared/types.js";
import bcrypt from "bcryptjs";

// User Schema
const userSchema = new mongoose.Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    companyName: {
      type: String,
      required: true,
      trim: true
    },
    businessType: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Settings Schema
const settingsSchema = new mongoose.Schema<Settings>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User"
    },
    whatsappConnected: { type: Boolean, default: false },
    smtpConfig: {
      email: { type: String, default: "" },
      password: { type: String, default: "" },
      host: { type: String, default: "" },
      port: { type: Number, default: 587 },
    },
    smsMessage: {
      type: String,
      default: "من فضلك قيم زيارتك من 1 إلى 5 عبر الرد على الرسالة. شكراً!",
    },
    googleMapsLink: {
      type: String,
      default: "https://maps.google.com/your-business-location",
    },
  },
  {
    timestamps: true,
  },
);

// Customer Schema
const customerSchema = new mongoose.Schema<Customer>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User"
    },
    name: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
  },
  {
    timestamps: true,
  },
);

// Compound unique index for phone + userId (each user can have their own customer list)
customerSchema.index({ phone: 1, userId: 1 }, { unique: true });

// Feedback Schema
const feedbackSchema = new mongoose.Schema<Feedback>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User"
    },
    customerId: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerName: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reason: { type: String },
    source: {
      type: String,
      enum: ["whatsapp", "email", "sms"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// Additional indexes for better performance
feedbackSchema.index({ userId: 1, customerId: 1, createdAt: -1 });
feedbackSchema.index({ userId: 1, rating: 1 });
settingsSchema.index({ userId: 1 }, { unique: true }); // One settings document per user

export const UserModel = mongoose.model<User>("User", userSchema);
export const SettingsModel = mongoose.model<Settings>(
  "Settings",
  settingsSchema,
);
export const CustomerModel = mongoose.model<Customer>(
  "Customer",
  customerSchema,
);
export const FeedbackModel = mongoose.model<Feedback>(
  "Feedback",
  feedbackSchema,
);
