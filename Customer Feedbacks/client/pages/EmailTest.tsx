import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, LogOut } from "lucide-react";

export default function EmailTest() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fromEmail: "",
    body: "",
    subject: "Re: تقييم الخدمة"
  });

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/email/test-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "✅ نجح الاختبار",
          description: result.message,
        });
        setFormData({ ...formData, body: "" });
      } else {
        toast({
          title: "❌ فشل الا��تبار",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ خطأ في الشبكة",
        description: "تعذر الاتصال بالخادم",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testScenarios = [
    { rating: "5", description: "تقييم ممتاز (5 نجوم)" },
    { rating: "4", description: "تقييم جيد (4 نجوم)" },
    { rating: "3", description: "تقييم متوسط (3 نجوم)" },
    { rating: "2", description: "تقييم ضعيف (2 نجمة)" },
    { rating: "1", description: "تقييم سيء (1 نجمة)" }
  ];

  const quickTest = (rating: string) => {
    setFormData({ ...formData, body: rating });
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Link to="/dashboard/overview" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <ArrowLeft className="h-4 w-4" />
                <span className="font-medium">العودة للداشبورد</span>
              </Link>
            </div>
            
            <h1 className="text-xl font-bold text-center text-gray-900 font-arabic">
              🧪 اختبار نظام الإيميلات
            </h1>
            
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
              <Link to="/dashboard/customers" className="text-gray-600 hover:text-blue-600">
                العملاء
              </Link>
              <Link to="/dashboard/feedback" className="text-gray-600 hover:text-blue-600">
                التقييمات
              </Link>
              <Link to="/dashboard/email-test" className="text-blue-600 font-medium">
                اختبار الإيميل
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 ml-2" />
                تسجيل خروج
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">🧪 اختبار نظام ردود الإيميلات</CardTitle>
            <CardDescription className="text-right">
              اختبر كيفية استجابة النظام لردود العملاء على إيميلات التقييم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fromEmail" className="text-right block">
                  إيميل العميل (المرسل)
                </Label>
                <Input
                  id="fromEmail"
                  type="email"
                  placeholder="customer@example.com"
                  value={formData.fromEmail}
                  onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                  required
                  className="text-right"
                />
                <p className="text-sm text-muted-foreground text-right">
                  يجب أن يكون هذا الإيميل موجود في قاعدة البيانات كعميل
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-right block">
                  موضوع الرسالة
                </Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body" className="text-right block">
                  محتوى الرد
                </Label>
                <Textarea
                  id="body"
                  placeholder="أدخل التقييم (رقم من 1 إلى 5) أو نص..."
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  required
                  className="text-right"
                  rows={4}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-right block font-medium">
                  اختبارات سريعة:
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {testScenarios.map((scenario) => (
                    <Button
                      key={scenario.rating}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => quickTest(scenario.rating)}
                      className="text-right justify-start"
                    >
                      {scenario.rating} - {scenario.description}
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => quickTest("الخدمة كانت ممتازة!")}
                    className="text-right justify-start"
                  >
                    نص إيجابي
                  </Button>
                  <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => quickTest("المكان مكنش نضيف والخدمة سيءة جدا")}
                  className="text-right justify-start"
                >
                  سبب التقييم السلبي
                </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading || !formData.fromEmail || !formData.body}
                className="w-full"
              >
                {loading ? "جاري الاختبار..." : "🚀 اختبار الرد"}
              </Button>
            </form>

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-right mb-2">💡 كيفية عمل النظام:</h3>
              <ul className="text-sm text-right space-y-1 text-muted-foreground">
                <li>• تقييم 4-5: رسالة شكر + رابط Google Maps الخاص بك</li>
                <li>• تقييم 1-3: رسالة شكر + طلب سبب التقييم</li>
                <li>• عند إرسال سبب: يتم حفظه في حقل "reason" بقاعدة البيانات</li>
                <li>• النظام يحفظ كل شيء مع userId للمستخدم الصحيح</li>
                <li>• يتم إرسال رد تلقائي للعميل حسب التقييم</li>
              </ul>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-right mb-2 text-blue-800">📋 خطوات الاختبار:</h3>
              <ol className="text-sm text-right space-y-1 text-blue-700">
                <li>1. أدخل إيميل عميل موجود في النظام</li>
                <li>2. اختر تقييم من الأزرار السريعة أو اكتب رقم</li>
                <li>3. اضغط "اختبار الرد"</li>
                <li>4. تحقق من إرسال الرد المناسب في السجلات</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
