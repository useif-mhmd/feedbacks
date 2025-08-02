import { Router, Request, Response } from "express";
import { UserModel, SettingsModel } from "../models/index.js";
import { generateToken } from "../services/auth.js";
import { RegisterRequest, LoginRequest, AuthResponse, BUSINESS_TYPES } from "../../shared/types.js";

const router = Router();

// Register new user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword, companyName, businessType }: RegisterRequest = req.body;

    // Validation
    if (!email || !password || !confirmPassword || !companyName || !businessType) {
      return res.status(400).json({
        success: false,
        message: "جميع الحقول مطلوبة"
      } as AuthResponse);
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "كلمات المرور غير متطابقة"
      } as AuthResponse);
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
      } as AuthResponse);
    }

    if (!BUSINESS_TYPES.includes(businessType as any)) {
      return res.status(400).json({
        success: false,
        message: "نوع النشاط غير صحيح"
      } as AuthResponse);
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "البريد الإلكتروني مستخدم بالفعل"
      } as AuthResponse);
    }

    // Create new user
    const user = new UserModel({
      email: email.toLowerCase(),
      password,
      companyName,
      businessType,
      isActive: true
    });

    await user.save();

    // Create default settings for the user
    const defaultSettings = new SettingsModel({
      userId: user._id!.toString(),
      whatsappConnected: false,
      smtpConfig: {
        email: "",
        password: "",
        host: "smtp.gmail.com",
        port: 587
      },
      smsMessage: "من فضلك قيم زيارتك من 1 إلى 5 عبر الرد على الرسالة. شكراً!",
      googleMapsLink: "https://maps.google.com/your-business-location"
    });

    await defaultSettings.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
      companyName: user.companyName
    });

    res.status(201).json({
      success: true,
      message: "تم إنشاء الحساب بنجاح",
      token,
      user: {
        id: user._id!.toString(),
        email: user.email,
        companyName: user.companyName,
        businessType: user.businessType
      }
    } as AuthResponse);

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ في إنشاء الحساب"
    } as AuthResponse);
  }
});

// Login user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "البريد الإلكتروني وكلمة المرور مطلوبان"
      } as AuthResponse);
    }

    // Find user
    const user = await UserModel.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "بيانات الدخول غير صحيحة"
      } as AuthResponse);
    }

    // Check password
    const isPasswordValid = await (user as any).comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "بيانات الدخول غير صحيحة"
      } as AuthResponse);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
      companyName: user.companyName
    });

    res.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      token,
      user: {
        id: user._id!.toString(),
        email: user.email,
        companyName: user.companyName,
        businessType: user.businessType
      }
    } as AuthResponse);

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ في تسجيل الدخول"
    } as AuthResponse);
  }
});

// Get business types
router.get("/business-types", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: BUSINESS_TYPES
  });
});

export default router;
