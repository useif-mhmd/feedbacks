import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/use-api";
import {
  MessageCircle,
  Mail,
  Smartphone,
  Upload,
  QrCode,
  Send,
  LogOut,
  Star,
  TrendingDown,
  Loader2,
  RefreshCw,
  RotateCcw,
  Info,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Clock,
} from "lucide-react";

// Types
interface WhatsAppStatus {
  status: string;
  qrCode?: string;
  message: string;
}

interface Settings {
  _id?: string;
  whatsappConnected: boolean;
  smtpConfig: {
    email: string;
    password: string;
    host: string;
    port: number;
  };
  smsMessage: string;
  googleMapsLink: string;
}

interface Customer {
  _id: string;
  name?: string;
  phone: string;
  email?: string;
}

interface Feedback {
  _id: string;
  customerPhone: string;
  customerName?: string;
  rating: number;
  reason?: string;
  source: string;
  createdAt: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const api = useApi();

  // State
  const [whatsappStatus, setWhatsappStatus] = useState<WhatsAppStatus>({
    status: "not_initialized",
    message: "",
  });
  const [settings, setSettings] = useState<Settings>({
    whatsappConnected: false,
    smtpConfig: { email: "", password: "", host: "smtp.gmail.com", port: 587 },
    smsMessage: "من فضلك قيم زيارتك من 1 إلى 5 عبر الرد على الرسالة. شكراً!",
    googleMapsLink: "https://maps.google.com/your-business-location",
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  // Auto-refresh WhatsApp status every 30 seconds
  const refreshWhatsAppStatus = useCallback(async () => {
    try {
      const response = await api.get("/api/whatsapp/status");
      if (response.ok) {
        const data = await response.json();
        setWhatsappStatus(data);
      }
    } catch (error) {
      console.error("Error refreshing WhatsApp status:", error);
    }
  }, [api]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load data sequentially to avoid overwhelming the server
        await loadSettings();
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay

        await refreshWhatsAppStatus();
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay

        await loadFeedback();
      } catch (error) {
        console.error("Error initializing dashboard data:", error);
      }
    };

    initializeData();

    // Auto-refresh every 30 seconds (only WhatsApp status)
    const interval = setInterval(() => {
      if (autoRefreshEnabled) {
        refreshWhatsAppStatus();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefreshEnabled]); // Removed refreshWhatsAppStatus from dependencies to avoid infinite re-renders

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  // API Functions
  const loadSettings = async () => {
    try {
      const response = await api.get("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const loadFeedback = async () => {
    try {
      const response = await api.get("/api/feedback/negative");
      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback || []);
      }
    } catch (error) {
      console.error("Error loading feedback:", error);
    }
  };

  const initializeWhatsApp = async () => {
    setLoading(true);
    try {
      const response = await api.post("/api/whatsapp/initialize");
      const data = await response.json();

      if (data.success) {
        setWhatsappStatus(data.status);
        toast({ title: "تم", description: "تم تهيئة WhatsApp بنجاح" });
      } else {
        toast({
          title: "خطأ",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تهيئة WhatsApp",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const resetWhatsAppAuth = async () => {
    setLoading(true);
    try {
      const response = await api.post("/api/whatsapp/reset-auth");
      const data = await response.json();

      if (data.success) {
        setWhatsappStatus(data.status);
        toast({
          title: "تم إعادة التعيين",
          description: "يمكن الآن لرقم جديد مسح QR Code",
        });
      } else {
        toast({
          title: "خطأ",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إعادة تعيين المصادقة",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const updateSmtpSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/settings/smtp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings.smtpConfig),
      });

      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
        toast({ title: "تم", description: "تم حفظ إعدادات SMTP" });
      } else {
        toast({
          title: "خطأ",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الإعدادات",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const updateSmsMessage = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/settings/sms-message", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: settings.smsMessage }),
      });

      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
        toast({ title: "تم", description: "تم حفظ رسالة SMS" });
      } else {
        toast({
          title: "خطأ",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الرسالة",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const updateGoogleMapsLink = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/settings/google-maps-link", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: settings.googleMapsLink }),
      });

      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
        toast({ title: "تم", description: "تم حفظ رابط Google Maps" });
      } else {
        toast({
          title: "خطأ",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الرابط",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/customers/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setCustomers(data.customers);
        toast({
          title: "تم",
          description: `تم رفع ${data.customers.length} عميل بنجاح`,
        });

        if (data.errors && data.errors.length > 0) {
          toast({
            title: "تحذير",
            description: `${data.errors.length} أخطاء في الملف`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "خطأ",
          description: data.errors?.[0] || "فشل في رفع الملف",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في رفع الملف",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const sendWhatsAppMessages = async () => {
    if (customers.length === 0) {
      toast({
        title: "خطأ",
        description: "لا توجد عملاء لإرسال الرسائل",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const customerIds = customers.map((c) => c._id);
      const response = await fetch("/api/customers/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerIds }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "تم",
          description: `تم إرسال ${data.sent} رسالة، فشل ${data.failed}`,
        });
      } else {
        toast({
          title: "خطأ",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إرسال الرسائل",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const sendEmails = async () => {
    if (customers.length === 0) {
      toast({
        title: "خطأ",
        description: "لا توجد عملاء لإرسال الإيميلات",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const customerIds = customers.map((c) => c._id);
      const response = await fetch("/api/customers/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerIds }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "تم",
          description: `تم إرسال ${data.sent} إيميل، فشل ${data.failed}`,
        });
      } else {
        toast({
          title: "خطأ",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إرسال الإيميلات",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const sendSMS = async () => {
    if (customers.length === 0) {
      toast({
        title: "خطأ",
        description: "لا توجد عملاء لإرسال SMS",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const customerIds = customers.map((c) => c._id);
      const response = await fetch("/api/customers/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerIds }),
      });

      const data = await response.json();

      toast({
        title: "معلومة",
        description: data.message || "SMS functionality not yet implemented",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إرسال SMS",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div  className="min-h-screen bg-gray-50 font-arabic" dir="rtl">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 rtl:space-x-reverse group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  لوحة التحكم
                </h1>
                <p className="text-sm text-gray-600">منصة تقييم العملاء</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  تحديث تلقائ�� كل 30 ثانية
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                >
                  {autoRefreshEnabled ? (
                    <Badge className="bg-green-100 text-green-800">مفعل</Badge>
                  ) : (
                    <Badge variant="outline">معطل</Badge>
                  )}
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg rounded-xl p-2">
            <TabsTrigger
              value="setup"
              className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              إعداد الاتصال
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              إعداد الرسائل
            </TabsTrigger>
            <TabsTrigger
              value="send"
              className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              إرسال التقييمات
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              التقييمات السلبية
            </TabsTrigger>
          </TabsList>

          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            {/* Instructions */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>خطوات الإعداد:</strong> ابدأ بربط رقم واتساب، ثم قم
                بإعداد SMTP للإيميلات. يمكن إعادة تعيين المصادقة لتبديل رقم
                واتساب في أي وقت.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
             <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] bg-gradient-to-br from-white to-green-50">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-green-700 text-lg font-semibold">
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg shadow-md">
        <MessageCircle className="h-5 w-5 text-white" />
      </div>
      ربط واتساب
      {autoRefreshEnabled && (
        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs animate-pulse ml-2">
          <Clock className="h-3 w-3" />
          تحديث تلقائي
        </div>
      )}
    </CardTitle>
    <CardDescription className="text-sm text-gray-600 mt-1">
      {whatsappStatus.message}
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-6 px-4">
    <div className="flex items-center justify-center h-80 bg-white rounded-xl border border-green-200 shadow-inner p-4">
      {whatsappStatus.status === "waiting_for_qr_scan" && whatsappStatus.qrCode ? (
        <div className="text-center space-y-4">
          <div className="bg-white p-3 rounded-xl shadow border border-gray-200 mx-auto w-fit">
            <img
              src={whatsappStatus.qrCode}
              alt="QR Code"
              className="w-60 h-60 object-contain"
            />
          </div>
          
        </div>
        
      ) : whatsappStatus.status === "ready" ? (
        <div className="text-center space-y-2">
          <div className="bg-green-100 text-green-600 p-3 rounded-full w-fit mx-auto shadow">
            <CheckCircle className="h-8 w-8" />
          </div>
          <p className="text-green-600 font-semibold text-lg">متصل بنجاح ✅</p>
          <p className="text-sm text-gray-600">جاهز لإرسال الرسائل</p>
        </div>
      ) : (
        <div className="text-center text-gray-500 space-y-2">
          <QrCode className="h-16 w-16 text-gray-400 mx-auto" />
          <p className="text-sm">اضغط "تهيئة" للبدء بربط الحساب</p>
        </div>
      )}
    </div>

    <div dir="rtl" className="flex items-center justify-center gap-2 text-green-700">
            <Smartphone className="h-5 w-5" />
            <p className="font-medium">امسح الكود بواتساب هاتفك</p>
          </div>
          <div dir="rtl" className="text-xs text-gray-500 leading-relaxed">
            <p>��� افتح تطبيق واتساب</p>
            <p>• اضغط على النقاط الثلاث في الأعلى</p>
            <p>• اختر "الأجهزة المربوطة"</p>
            <p>• امسح الكود أعلاه</p>
          </div>

    <div className="flex gap-2">
      <Button
        className="flex-1"
        onClick={initializeWhatsApp}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin ml-2" />
            جاري التهيئة...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 ml-2" />
            {whatsappStatus.status === "ready" ? "إعادة التهيئة" : "تهيئة WhatsApp"}
          </>
        )}
      </Button>

      <Button
        variant="outline"
        onClick={resetWhatsAppAuth}
        disabled={loading}
        title="إعادة تعيين لربط رقم جديد"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RotateCcw className="h-4 w-4" />
        )}
      </Button>
    </div>

    <Alert className="bg-green-50 border-green-200 text-green-800">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-sm">
        <strong>ملاحظة:</strong> يتم التحديث التلقائي كل 30 ثانية. استخدم "إعادة تعيين" لتبديل رقم واتساب.
      </AlertDescription>
    </Alert>
  </CardContent>
</Card>

              {/* SMTP Setup */}
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-white to-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    إعداد��ت SMTP
                  </CardTitle>
                  <CardDescription>
                    إعداد البريد الإلكتروني للإرسال والردود التلقائية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>لـ Gmail:</strong> استخدم App Password بدلاً من
                      كلمة المرور العادية.
                      <a
                        href="https://support.google.com/accounts/answer/185833"
                        target="_blank"
                        className="text-blue-600 mr-1"
                      >
                        كيفية إنشائه <ExternalLink className="h-3 w-3 inline" />
                      </a>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label>البريد الإلكتروني</Label>
                    <Input
                      type="email"
                      value={settings.smtpConfig.email}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          smtpConfig: {
                            ...settings.smtpConfig,
                            email: e.target.value,
                          },
                        })
                      }
                      placeholder="your-email@gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>كلمة المرور (App Password)</Label>
                    <Input
                      type="password"
                      value={settings.smtpConfig.password}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          smtpConfig: {
                            ...settings.smtpConfig,
                            password: e.target.value,
                          },
                        })
                      }
                      placeholder="App Password"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SMTP Host</Label>
                      <Input
                        value={settings.smtpConfig.host}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            smtpConfig: {
                              ...settings.smtpConfig,
                              host: e.target.value,
                            },
                          })
                        }
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Port</Label>
                      <Input
                        type="number"
                        value={settings.smtpConfig.port}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            smtpConfig: {
                              ...settings.smtpConfig,
                              port: parseInt(e.target.value) || 587,
                            },
                          })
                        }
                        placeholder="587"
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={updateSmtpSettings}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    ) : null}
                    حفظ إعدادات SMTP
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            {/* Instructions */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>إعداد الرسائل والروابط:</strong> يمكن تخصيص رسالة SMS
                ورابط Google Maps. سيتم استخدام الرابط عند حصول العميل على 4-5
                نجوم.
              </AlertDescription>
            </Alert>

            <div className="grid gap-6">
              {/* Google Maps Link */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-green-600" />
                    رابط Google Maps
                  </CardTitle>
                  <CardDescription>
                    الرابط الذي سيتم إرساله للعملاء عند التقييم الإيجابي (4-5
                    نجوم)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>��ابط موقعك على Google Maps</Label>
                    <Input
                      type="url"
                      value={settings.googleMapsLink}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          googleMapsLink: e.target.value,
                        })
                      }
                      placeholder="https://maps.google.com/your-business-location"
                      className="text-left"
                      dir="ltr"
                    />
                  </div>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      للحصول على الرابط: ابحث عن مؤسستك في Google Maps، اضغط
                      "مشاركة"، انسخ الرابط
                    </AlertDescription>
                  </Alert>
                  <Button onClick={updateGoogleMapsLink} disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    ) : null}
                    حفظ رابط Google Maps
                  </Button>
                </CardContent>
              </Card>

              {/* SMS Message */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                    رسالة SMS
                  </CardTitle>
                    <CardDescription>
                    الرسالة التي سيتم إرسالها لجميع العملاء عبر SMS. يمكنك تخصيصها حسب احتياجك.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={settings.smsMessage}
                    onChange={(e) =>
                      setSettings({ ...settings, smsMessage: e.target.value })
                    }
                    placeholder="اكتب رسالة SMS هنا..."
                    rows={4}
                  />
                  <Button onClick={updateSmsMessage} disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    ) : null}
                    حفظ رسالة SMS
                  </Button>
                </CardContent>
              </Card>

              {/* Message Templates Preview */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">قالب واتساب</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-50 p-4 rounded-lg text-sm border-2 border-green-200">
                      🌟 <strong>شكراً لزيارتك اليوم!</strong>
                      <br />
                      إحنا سعداء جداً إنك شرفتنا في فرعنا ❤️
                      <br /><br />
                      <strong>من فضلك قيّم تجربتك معنا:</strong>
                      <br />
                      ⭐️ = 1 | ⭐️⭐️ = 2 | ⭐️⭐️⭐️ = 3
                      <br />
                      ⭐️⭐️⭐️⭐️ = 4 | ⭐️⭐️⭐️⭐️⭐️ = 5
                      <br /><br />
                      <strong>ارسل عدد النجوم أو الرقم المناسب</strong>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      ✅ قالب نجوم تفاعلي + معالجة ردود تلقائية
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">قالب الإيميل</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-4 rounded-lg text-sm border-2 border-blue-200">
                      <p>أهلاً بك!</p>
                      <p>سعداء جداً إنك زرت فرعنا النهارده ❤️</p>
                      <p>من فضلك قيّم زيارتك:</p>
                      <p>
                        ⭐️ | ⭐️⭐️ | ⭐️⭐️⭐️ | ⭐️⭐️⭐️⭐️ |
                        ⭐️⭐️⭐️⭐️⭐️
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      ✅ HTML تفاعلي + معالجة ردود + رابط Google Maps
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">قالب SMS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-purple-50 p-4 rounded-lg text-sm border-2 border-purple-200">
                      {settings.smsMessage}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      ⏳ قيد التطوير - يتطلب مزود SMS
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Send Tab */}
          <TabsContent value="send" className="space-y-6">
            {/* Instructions */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>خطوات الإرسال:</strong>
                1) ارفع ملف Excel بالتنسيق المحدد 2) تأكد من الإعدادات 3) اختر
                طريقة الإرسال. سيتم معالجة الردود تلقائياً.
              </AlertDescription>
            </Alert>

            <div className="grid gap-6">
              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    رفع ملف Excel
                  </CardTitle>
                  <CardDescription>
                    ارفع ملف Excel ب��لتنسيق المطلوب: أرقام هواتف (عمود A)،
                    إيميلات (عمود B)، أسماء (عمود C)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>تنسيق الملف المطلوب:</strong>
                      <br />
                      • عمود A: أرقام الهواتف (مطلوب) - مثال: 01012345678
                      <br />
                      • عمود B: عناوين الإيميل (اختياري) - مثال: ahmed@gmail.com
                      <br />• عمود C: أسماء العملاء (اختياري) - مثال: أحمد محمد
                    </AlertDescription>
                  </Alert>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">اضغط لرفع ملف Excel</p>
                      <p className="text-sm text-gray-400">
                        xlsx, xls - حد أقصى 10MB
                      </p>
                    </label>
                  </div>
                  {uploadedFile && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-green-700 font-medium">
                            تم رفع الملف: {uploadedFile.name}
                          </p>
                          <p className="text-sm text-green-600">
                            العملاء المحملين: {customers.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Send Buttons */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="bg-green-100 text-green-600 p-3 rounded-full w-fit mx-auto mb-4">
                      <MessageCircle className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold mb-2">إرسال عبر واتساب</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      رسائل تقييم مع معالجة ردود تلقائية
                    </p>

                    {whatsappStatus.status === "ready" ? (
                      <Badge className="bg-green-100 text-green-800 mb-3">
                        ✅ جاهز
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="mb-3">
                        ⏳ يتطلب ربط واتساب
                      </Badge>
                    )}

                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={
                        whatsappStatus.status !== "ready" ||
                        customers.length === 0 ||
                        loading
                      }
                      onClick={sendWhatsAppMessages}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      ) : (
                        <Send className="h-4 w-4 ml-2" />
                      )}
                      إرسال واتساب
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-fit mx-auto mb-4">
                      <Mail className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold mb-2">إرسل عبر الإيميل</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      إيميلات HTML مع معالجة ردود ذكية
                    </p>

                    {settings.smtpConfig.email ? (
                      <Badge className="bg-blue-100 text-blue-800 mb-3">
                        ✅ جاهز
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="mb-3">
                        ⏳ يتطلب إعداد SMTP
                      </Badge>
                    )}

                    <Button
                      className="w-full"
                      disabled={
                        !settings.smtpConfig.email ||
                        customers.length === 0 ||
                        loading
                      }
                      onClick={sendEmails}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      ) : (
                        <Send className="h-4 w-4 ml-2" />
                      )}
                      إرسال إيميل
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-fit mx-auto mb-4">
                      <Smartphone className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold mb-2">إرسال SMS</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      رسائل نصية سريعة ومباشرة
                    </p>

                    <Badge variant="outline" className="mb-3">
                      ⏳ قيد التطوير
                    </Badge>

                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={customers.length === 0 || loading}
                      onClick={sendSMS}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      ) : (
                        <Send className="h-4 w-4 ml-2" />
                      )}
                      إرسال SMS
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Process Explanation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    كيف تعمل المعالجة التلقائية؟
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">
                        ✅ ت��ييم إيجابي (4-5 نجوم)
                      </h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• شكر العميل على التقييم الممتاز</li>
                        <li>• إرسال ��ابط Google Maps للمر����عة</li>
                        <li>• تسجيل ��لتقييم كـ "تم المعالجة"</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">
                        ⚠️ تقييم سلبي (1-3 نجوم)
                      </h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• طلب توضيح سبب عدم الرضا</li>
                        <li>• حفظ السبب في قاعدة البيانات</li>
                        <li>• عرض في تبويب "التقييمات السلبية"</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Negative Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            {/* Instructions */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>متابعة التقييمات السلبية:</strong> هنا تظهر جميع
                التقييمات أقل من 4 نجوم مع أسباب عدم الرضا. استخدم هذه المعلومات
                لتحسين الخدمة.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  التقييمات السلبية
                </CardTitle>
                <CardDescription>
                  العملاء الذين قيموا بأقل من 4 نجوم مع أسباب عدم الرضا لاتخاذ
                  إجراءات تحسين
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-right p-3 font-semibold">
                          الاسم / الرقم
                        </th>
                        <th className="text-right p-3 font-semibold">
                          التقييم
                        </th>
                        <th className="text-right p-3 font-semibold">
                          سبب عدم الرضا
                        </th>
                        <th className="text-right p-3 font-semibold">المصدر</th>
                        <th className="text-right p-3 font-semibold">
                          التاريخ
                        </th>
                        <th className="text-right p-3 font-semibold">إجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedback.map((item) => (
                        <tr
                          key={item._id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-3">
                            <div>
                              <p className="font-medium">
                                {item.customerName || "غير محدد"}
                              </p>
                              <p className="text-sm text-gray-600">
                                {item.customerPhone}
                              </p>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < item.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 mr-2">
                                ({item.rating}/5)
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <p className="text-sm">
                              {item.reason || "لم يتم تقديم سبب بعد"}
                            </p>
                          </td>
                          <td className="p-3">
                            <Badge
                              variant="outline"
                              className={
                                item.source === "whatsapp"
                                  ? "border-green-500 text-green-700"
                                  : item.source === "email"
                                    ? "border-blue-500 text-blue-700"
                                    : "border-purple-500 text-purple-700"
                              }
                            >
                              {item.source === "whatsapp"
                                ? "واتساب"
                                : item.source === "email"
                                  ? "إيميل"
                                  : "SMS"}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <p className="text-sm text-gray-600">
                              {new Date(item.createdAt).toLocaleDateString(
                                "ar-EG",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </td>
                          <td className="p-3">
                            <Button variant="outline" size="sm">
                              متابعة
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {feedback.length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        ممتاز! 🎉
                      </h3>
                      <p className="text-gray-600">
                        لا توجد تقييمات سلبية حتى الآن
                      </p>
                      <p className="text-sm text-gray-500">
                        يبدو أن عملائكم راضون عن الخدمة
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
