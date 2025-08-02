import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/use-api";
import {
  Mail,
  Smartphone,
  ExternalLink,
  Info,
  Loader2,
  ArrowLeft,
  Settings as SettingsIcon,
  Save,
} from "lucide-react";

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

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({
    whatsappConnected: false,
    smtpConfig: { email: "", password: "", host: "smtp.gmail.com", port: 587 },
    smsMessage: "من فضلك قيم زيارتك من 1 إلى 5 عبر الرد على الرسالة. شكراً!",
    googleMapsLink: "https://maps.google.com/your-business-location",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const api = useApi();

  useEffect(() => {
    loadSettings();
  }, []);

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

  const updateSmtpSettings = async () => {
    setLoading(true);
    try {
      const response = await api.put("/api/settings/smtp", settings.smtpConfig);
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
      const response = await api.put("/api/settings/sms-message", { 
        message: settings.smsMessage 
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
      const response = await api.put("/api/settings/google-maps-link", { 
        link: settings.googleMapsLink 
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

  return (
    <div className="min-h-screen bg-gray-50 font-arabic" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Link to="/dashboard/overview" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <ArrowLeft className="h-4 w-4" />
                العودة
              </Link>
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-2 rounded-lg">
                <SettingsIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">الإعدادات</h1>
                <p className="text-sm text-gray-600">إعدادات البريد والرسائل</p>
              </div>
            </div>

            <nav className="flex items-center space-x-4 rtl:space-x-reverse">
              <Link to="/dashboard/overview" className="text-gray-600 hover:text-blue-600">
                الإحصائيات
              </Link>
              <Link to="/dashboard/whatsapp" className="text-gray-600 hover:text-blue-600">
                واتساب
              </Link>
              <Link to="/dashboard/settings" className="text-blue-600 font-medium">
                الإعدادات
              </Link>
              <Link to="/dashboard/customers" className="text-gray-600 hover:text-blue-600">
                العملاء
              </Link>
              <Link to="/dashboard/feedback" className="text-gray-600 hover:text-blue-600">
                التقييمات
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* SMTP Settings */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                <Mail className="h-5 w-5 text-white" />
              </div>
              إعدادات SMTP
            </CardTitle>
            <CardDescription>
              إعداد البريد الإلكتروني للإرسال والردود التلقائية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>لـ Gmail:</strong> استخدم App Password بدلاً من كلمة المرور العادية.
                <a
                  href="https://support.google.com/accounts/answer/185833"
                  target="_blank"
                  className="text-blue-600 mr-1"
                >
                  كيفية إنشائه <ExternalLink className="h-3 w-3 inline" />
                </a>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="text-left"
                  dir="ltr"
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
                  className="text-left"
                  dir="ltr"
                />
              </div>
              
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
                  className="text-left"
                  dir="ltr"
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
              onClick={updateSmtpSettings}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              ) : (
                <Save className="h-4 w-4 ml-2" />
              )}
              حفظ إعدادات SMTP
            </Button>
          </CardContent>
        </Card>

        {/* Google Maps Link */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-green-600" />
              رابط Google Maps
            </CardTitle>
            <CardDescription>
              الرابط الذي سيتم إرساله للعملاء عند التقييم الإيجابي (4-5 نجوم)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>رابط موقعك على Google Maps</Label>
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
                للحصول على الرابط: ابحث عن مؤسستك في Google Maps، اضغط "مشاركة"، انسخ الرابط
              </AlertDescription>
            </Alert>
            <Button onClick={updateGoogleMapsLink} disabled={loading} size="lg" className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              ) : (
                <Save className="h-4 w-4 ml-2" />
              )}
              حفظ رابط Google Maps
            </Button>
          </CardContent>
        </Card>

        {/* SMS Message */}
        <Card className="border-0 shadow-xl">
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
            <Button onClick={updateSmsMessage} disabled={loading} size="lg" className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              ) : (
                <Save className="h-4 w-4 ml-2" />
              )}
              حفظ رسالة SMS
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
