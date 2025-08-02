import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle, ArrowRight, AlertCircle, Building2 } from "lucide-react";
import { RegisterRequest, AuthResponse, BusinessType } from "@shared/types";

export default function Register() {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    businessType: "",
  });
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Load business types
  useEffect(() => {
    const loadBusinessTypes = async () => {
      try {
        const response = await fetch("/api/auth/business-types");
        const data = await response.json();
        if (data.success) {
          setBusinessTypes(data.data);
        }
      } catch (error) {
        console.error("Error loading business types:", error);
      }
    };
    loadBusinessTypes();
  }, []);

  const handleInputChange = (field: keyof RegisterRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!formData.email || !formData.password || !formData.confirmPassword || 
        !formData.companyName || !formData.businessType) {
      setError("جميع الحقول مطلوبة");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.token) {
        // Store token and user info
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        setError(data.message || "حدث خطأ في إنشاء الحساب");
      }
    } catch (error) {
      setError("حدث خطأ في الاتصال بالخادم");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 font-arabic">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 rtl:space-x-reverse"
          >
            <div className="bg-blue-600 text-white p-3 rounded-xl">
              <MessageCircle className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              منصة تقييم العملاء
            </span>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center space-y-2" dir="rtl">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              إنشاء حساب جديد
            </CardTitle>
            <CardDescription className="text-gray-600">
              أنشئ حساب لشركتك وابدأ في جمع تقييمات العملاء
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6" dir="rtl">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-right block">
                  اسم الشركة/المؤسسة
                </Label>
                <Input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="مطعم الحارة الشعبية"
                  className="text-right"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType" className="text-right block">
                  نوع النشاط التجاري
                </Label>
                <Select 
                  value={formData.businessType} 
                  onValueChange={(value) => handleInputChange("businessType", value)}
                >
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر نوع النشاط" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-right block">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="company@example.com"
                  className="text-left"
                  dir="ltr"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block">
                  كلمة المرور
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="كلمة المرور (6 أحرف على الأقل)"
                  className="text-left"
                  dir="ltr"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-right block">
                  تأكيد كلمة المرور
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="أعد كتابة كلمة المرور"
                  className="text-left"
                  dir="ltr"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                <ArrowRight className="h-4 w-4 mr-2" />
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  تسجيل الدخول
                </Link>
              </p>
              
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                العودة للصفحة الرئيسية
              </Link>
            </div>

            {/* Features Preview */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-2 text-right">
                ما ستحصل عليه:
              </h4>
              <div className="text-sm text-gray-600 space-y-1 text-right">
                <p>✅ ربط واتساب لإرسال رسائل التقييم</p>
                <p>✅ إرسال إيميلات تقييم احترافية</p>
                <p>✅ متابعة التقييمات السلبية</p>
                <p>✅ لوحة تحكم شاملة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
