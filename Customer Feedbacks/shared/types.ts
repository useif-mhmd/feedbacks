// Database Models

// User Schema for authentication and company management
export interface User {
  _id?: string;
  email: string;
  password: string; // hashed
  companyName: string;
  businessType: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Settings {
  _id?: string;
  userId: string; // Reference to User
  whatsappConnected: boolean;
  smtpConfig: {
    email: string;
    password: string;
    host: string;
    port: number;
  };
  smsMessage: string;
  googleMapsLink: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Customer {
  _id?: string;
  userId: string; // Reference to User
  name?: string;
  phone: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Feedback {
  _id?: string;
  userId: string; // Reference to User
  customerId: string;
  customerPhone: string;
  customerName?: string;
  rating: number;
  reason?: string;
  source: "whatsapp" | "email" | "sms" | "web";
  status: "pending" | "processed";
  createdAt?: Date;
  updatedAt?: Date;
}

// Authentication Types
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  businessType: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    companyName: string;
    businessType: string;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  companyName: string;
  iat?: number;
  exp?: number;
}

// Business Type Options
export const BUSINESS_TYPES = [
  "مطعم",
  "كافيه",
  "محل تجاري",
  "صالون تجميل",
  "عيادة",
  "ورشة",
  "مكتب خدمات",
  "فندق",
  "شركة",
  "أخرى"
] as const;

export type BusinessType = typeof BUSINESS_TYPES[number];

// API Response Types
export interface WhatsAppStatus {
  status:
    | "not_initialized"
    | "initializing"
    | "waiting_for_qr_scan"
    | "ready"
    | "disconnected"
    | "auth_failed";
  qrCode?: string;
  message: string;
}

export interface SendMessageRequest {
  customers: Array<{
    phone: string;
    email?: string;
    name?: string;
  }>;
  type: "whatsapp" | "email" | "sms";
}

export interface SendMessageResponse {
  success: boolean;
  sent: number;
  failed: number;
  errors?: string[];
}

export interface UploadFileResponse {
  success: boolean;
  customers: Customer[];
  errors?: string[];
}

// Bot Status Type
export type BotStatus =
  | "initializing"
  | "waiting_for_qr_scan"
  | "ready"
  | "disconnected"
  | "auth_failed"
  | "restarting"
  | "not_initialized";
