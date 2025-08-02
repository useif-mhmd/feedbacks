import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/use-api";
import {
  MessageCircle,
  QrCode,
  CheckCircle,
  Loader2,
  RefreshCw,
  RotateCcw,
  AlertCircle,
  Info,
  Clock,
  Smartphone,
  ArrowLeft,
} from "lucide-react";

interface WhatsAppStatus {
  status: string;
  qrCode?: string;
  message: string;
}

export default function WhatsAppSettings() {
  const [whatsappStatus, setWhatsappStatus] = useState<WhatsAppStatus>({
    status: "not_initialized",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const { toast } = useToast();
  const api = useApi();

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
    refreshWhatsAppStatus();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (autoRefreshEnabled) {
        refreshWhatsAppStatus();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshWhatsAppStatus, autoRefreshEnabled]);

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
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-2 rounded-lg">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">إعدادات واتساب</h1>
                <p className="text-sm text-gray-600">ربط وإدارة اتصال واتساب</p>
              </div>
            </div>

            <nav className="flex items-center space-x-4 rtl:space-x-reverse">
              <Link to="/dashboard/overview" className="text-gray-600 hover:text-blue-600">
                الإحصائيات
              </Link>
              <Link to="/dashboard/whatsapp" className="text-blue-600 font-medium">
                واتساب
              </Link>
              <Link to="/dashboard/settings" className="text-gray-600 hover:text-blue-600">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>خطوات الربط:</strong> اضغط "تهيئة واتساب" للحصول على QR Code، ثم امسحه بتطبيق واتساب على هاتفك.
            كل حساب له ربط منفصل ومستقل.
          </AlertDescription>
        </Alert>

        {/* WhatsApp Connection Card */}
        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] bg-gradient-to-br from-white to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 text-xl font-semibold">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-md">
                <MessageCircle className="h-6 w-6 text-white" />
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

          <CardContent className="space-y-6 px-6">
            {/* Auto-refresh Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">تحديث تلقائي كل 30 ثانية</span>
              </div>
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

            {/* QR Code Display */}
            <div className="flex items-center justify-center h-96 bg-white rounded-xl border border-green-200 shadow-inner p-6">
              {whatsappStatus.status === "waiting_for_qr_scan" && whatsappStatus.qrCode ? (
                <div className="text-center space-y-6">
                  <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 mx-auto w-fit">
                    <img
                      src={whatsappStatus.qrCode}
                      alt="QR Code"
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-green-700">
                      <Smartphone className="h-5 w-5" />
                      <p className="font-medium">امسح الكود بواتساب هاتفك</p>
                    </div>
                    
                  </div>
                </div>
                
              ) : whatsappStatus.status === "ready" ? (
                <div className="text-center space-y-4">
                  <div className="bg-green-100 text-green-600 p-4 rounded-full w-fit mx-auto shadow-lg">
                    <CheckCircle className="h-12 w-12" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-green-600 font-bold text-xl">متصل بنجاح! ✅</p>
                    <p className="text-gray-600">جاهز لإرسال رسائل التقييم</p>
                    <Badge className="bg-green-100 text-green-800 px-3 py-1">
                      نشط ومتصل
                    </Badge>
                  </div>
                </div>
              ) : whatsappStatus.status === "initializing" ? (
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 text-blue-600 mx-auto animate-spin" />
                  <p className="text-blue-600 font-medium">جاري تهيئة الاتصال...</p>
                  <p className="text-sm text-gray-500">قد يستغرق هذا بضع ثواني</p>
                </div>
              ) : (
                <div className="text-center text-gray-500 space-y-4">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">اضغط "تهيئة واتساب" للبدء</p>
                    <p className="text-sm">ستظهر كود QR للمسح بهاتفك</p>
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500 leading-relaxed space-y-1">
                      <p>• افتح تطبيق واتساب على هاتفك</p>
                      <p>• اضغط على النقاط الثلاث (⋮) في الأعلى</p>
                      <p>• اختر "الأجهزة المربوطة"</p>
                      <p>• اضغط "ربط جهاز" وامسح الكود أعلاه</p>
                    </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={initializeWhatsApp}
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جاري التهيئة...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 ml-2" />
                    {whatsappStatus.status === "ready" ? "إعادة التهيئة" : "تهيئة واتساب"}
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={resetWhatsAppAuth}
                disabled={loading}
                title="إعادة تعيين لربط رقم جديد"
                size="lg"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4 ml-2" />
                    إعادة تعيين
                  </>
                )}
              </Button>
            </div>

            {/* Status Alerts */}
            {whatsappStatus.status === "ready" && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>ممتاز!</strong> واتساب متصل وجاهز لإرسال رسائل التقييم. يمكنك الآن الذهاب إلى صفحة العملاء لإرسال الرسائل.
                </AlertDescription>
              </Alert>
            )}

            {whatsappStatus.status === "auth_failed" && (
              <Alert className="bg-red-50 border-red-200 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>فشل في التوثيق!</strong> اضغط "إعادة تعيين" ثم حاول مرة أخرى.
                </AlertDescription>
              </Alert>
            )}

            <Alert className="bg-blue-50 border-blue-200 text-blue-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>ملاحظة هامة:</strong> كل حساب له ربط واتساب منفصل ومستقل. استخدم "إعادة تعيين" فقط إذا كنت تريد ربط رقم جديد.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/dashboard/customers" className="block">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">إرسال رسائل</h3>
                    <p className="text-sm text-gray-600">رفع العملاء وإرسال رسائل التقييم</p>
                  </div>
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/feedback" className="block">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">متابعة الردود</h3>
                    <p className="text-sm text-gray-600">مراجعة التقييمات والردود الواردة</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
