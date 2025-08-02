import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/use-api";
import {
  Upload,
  Users,
  MessageCircle,
  Mail,
  Smartphone,
  Send,
  Loader2,
  CheckCircle,
  Info,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

interface Customer {
  _id: string;
  name?: string;
  phone: string;
  email?: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [migrating, setMigrating] = useState(false);
  const { toast } = useToast();
  const api = useApi();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await api.get("/api/customers");
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error("Error loading customers:", error);
    }
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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
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
      const response = await api.post("/api/customers/send-whatsapp", { customerIds });
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
      const response = await api.post("/api/customers/send-email", { customerIds });
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

  const handleMigration = async () => {
    setMigrating(true);
    try {
      const response = await api.post("/api/migration/migrate-customers");
      const data = await response.json();

      if (data.success) {
        toast({
          title: "تم",
          description: `تم ترحيل ${data.results.customersMigrated} عميل بنجاح`,
        });

        // Reload customers after migration
        await loadCustomers();
      } else {
        toast({
          title: "خطأ",
          description: data.message || "فشل في الترحيل",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في ترحيل البيانات",
        variant: "destructive",
      });
    }
    setMigrating(false);
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
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-2 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">إدارة العملاء</h1>
                <p className="text-sm text-gray-600">رفع العملاء وإرسال الرسائل</p>
              </div>
            </div>

            <nav className="flex items-center space-x-4 rtl:space-x-reverse">
              <Link to="/dashboard/overview" className="text-gray-600 hover:text-blue-600">
                الإحصائيات
              </Link>
              <Link to="/dashboard/whatsapp" className="text-gray-600 hover:text-blue-600">
                واتساب
              </Link>
              <Link to="/dashboard/settings" className="text-gray-600 hover:text-blue-600">
                الإعدادات
              </Link>
              <Link to="/dashboard/customers" className="text-blue-600 font-medium">
                العملاء
              </Link>
              <Link to="/dashboard/feedback" className="text-gray-600 hover:text-blue-600">
                التقييمات
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Instructions */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>خطوات الإرسال:</strong>
            1) ارفع ملف Excel بالتنسيق المحدد 2) تأكد من ربط واتساب والإعدادات 3) اختر طريقة الإرسال
          </AlertDescription>
        </Alert>

        {/* Migration Alert */}
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong className="text-blue-800">إصلاح مشاكل رفع الملفات:</strong>
              <span className="text-blue-700"> إذا واجهت أخطاء عند رفع ملف Excel، اضغط هنا لترحيل البيانات القديمة</span>
            </div>
            <Button
              onClick={handleMigration}
              disabled={migrating}
              variant="outline"
              size="sm"
              className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200 ml-4"
            >
              {migrating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-1" />
                  جاري الترحيل...
                </>
              ) : (
                "ترحيل البيانات"
              )}
            </Button>
          </AlertDescription>
        </Alert>

        {/* File Upload */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              رفع ملف Excel
            </CardTitle>
            <CardDescription>
              ارفع ملف Excel بالتنسيق المطلوب: أرقام هواتف (عمود A)، إيميلات (عمود B)، أسماء (عمود C)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={loading}
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

        {/* Customers List */}
        {customers.length > 0 && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                قائمة العملاء ({customers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-60 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {customers.slice(0, 50).map((customer) => (
                    <div key={customer._id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">{customer.name || `عميل ${customer.phone.slice(-4)}`}</p>
                      <p className="text-sm text-gray-600">{customer.phone}</p>
                      {customer.email && (
                        <p className="text-xs text-blue-600">{customer.email}</p>
                      )}
                    </div>
                  ))}
                  {customers.length > 50 && (
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <p className="text-blue-600">+{customers.length - 50} عميل آخر</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Send Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 text-green-600 p-3 rounded-full w-fit mx-auto mb-4">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">إرسال عبر واتساب</h3>
              <p className="text-sm text-gray-600 mb-4">
                رسائل تقييم مع معالجة ردود تلقائية
              </p>

              <Badge className="bg-green-100 text-green-800 mb-4">
                ✅ الطريقة المفضلة
              </Badge>

              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={customers.length === 0 || loading}
                onClick={sendWhatsAppMessages}
                size="lg"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                ) : (
                  <Send className="h-4 w-4 ml-2" />
                )}
                إرسال واتساب
              </Button>
              
              <p className="text-xs text-gray-500 mt-2">
                يتطلب ربط واتساب أولاً
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-fit mx-auto mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">إرسال عبر الإيميل</h3>
              <p className="text-sm text-gray-600 mb-4">
                إيميلات HTML مع معالجة ردود ذكية
              </p>

              <Badge className="bg-blue-100 text-blue-800 mb-4">
                ✅ جودة عالية
              </Badge>

              <Button
                className="w-full"
                disabled={customers.length === 0 || loading}
                onClick={sendEmails}
                size="lg"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                ) : (
                  <Send className="h-4 w-4 ml-2" />
                )}
                إرسال إيميل
              </Button>
              
              <p className="text-xs text-gray-500 mt-2">
                يتطلب إعداد SMTP أولاً
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-fit mx-auto mb-4">
                <Smartphone className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">إرسال SMS</h3>
              <p className="text-sm text-gray-600 mb-4">
                رسائل نصية سريعة ومباشرة
              </p>

              <Badge variant="outline" className="mb-4">
                ⏳ قيد التطوير
              </Badge>

              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={true}
                size="lg"
              >
                <Send className="h-4 w-4 ml-2" />
                إرسال SMS
              </Button>
              
              <p className="text-xs text-gray-500 mt-2">
                سيتم إضافته قريباً
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/dashboard/whatsapp" className="block">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">ربط واتساب</h3>
                    <p className="text-sm text-gray-600">تأكد من ربط واتساب قبل الإرسال</p>
                  </div>
                  <ExternalLink className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/settings" className="block">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">إعدادات SMTP</h3>
                    <p className="text-sm text-gray-600">إعداد البريد للإرسال عبر الإيميل</p>
                  </div>
                  <ExternalLink className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
