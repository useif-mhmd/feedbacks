import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useApi } from "@/hooks/use-api";
import {
  TrendingDown,
  Star,
  CheckCircle,
  Info,
  ArrowLeft,
  MessageCircle,
  Mail,
  Smartphone,
  Calendar,
  User,
} from "lucide-react";

interface Feedback {
  _id: string;
  customerPhone: string;
  customerName?: string;
  rating: number;
  reason?: string;
  source: string;
  createdAt: string;
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const response = await api.get("/api/feedback/negative");
      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback || []);
      }
    } catch (error) {
      console.error("Error loading feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "whatsapp":
        return <MessageCircle className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <Smartphone className="h-4 w-4" />;
      case "web":
        return <Star className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "whatsapp":
        return "border-green-500 text-green-700 bg-green-50";
      case "email":
        return "border-blue-500 text-blue-700 bg-blue-50";
      case "sms":
        return "border-purple-500 text-purple-700 bg-purple-50";
      case "web":
        return "border-yellow-500 text-yellow-700 bg-yellow-50";
      default:
        return "border-gray-500 text-gray-700 bg-gray-50";
    }
  };

  const getSourceText = (source: string) => {
    switch (source) {
      case "whatsapp":
        return "واتساب";
      case "email":
        return "إيميل";
      case "sms":
        return "SMS";
      case "web":
        return "موقع إلكتروني";
      default:
        return source;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-arabic flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل التقييمات...</p>
        </div>
      </div>
    );
  }

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
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-2 rounded-lg">
                <TrendingDown className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">التقييمات السلبية</h1>
                <p className="text-sm text-gray-600">متابعة ومراجعة الشكاوى</p>
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
              <Link to="/dashboard/customers" className="text-gray-600 hover:text-blue-600">
                العملاء
              </Link>
              <Link to="/dashboard/feedback" className="text-blue-600 font-medium">
                التقييمات
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>متابعة التقييمات السلبية:</strong> هنا تظهر جميع التقييمات أقل من 4 نجوم مع أسباب عدم الرضا. 
            استخدم هذه المعلومات لتحسين الخدمة والتواصل مع العملاء.
          </AlertDescription>
        </Alert>

        {/* Feedback List */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              التقييمات السلبية ({feedback.length})
            </CardTitle>
            <CardDescription>
              العملاء الذين قيموا بأقل من 4 نجوم مع أسباب عدم الرضا
            </CardDescription>
          </CardHeader>
          <CardContent>
            {feedback.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ممتاز! 🎉
                </h3>
                <p className="text-gray-600 mb-1">
                  لا توجد تقييمات سلبية حتى الآن
                </p>
                <p className="text-sm text-gray-500">
                  يبدو أن عملائكم راضون عن الخدمة
                </p>
                <div className="mt-6">
                  <Link to="/dashboard/customers">
                    <Button className="bg-green-600 hover:bg-green-700">
                      إرسال المزيد من رسائل التقييم
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {feedback.map((item) => (
                  <div
                    key={item._id}
                    className="p-6 border border-red-100 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-full">
                          <User className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.customerName || "عميل غير محدد"}
                          </p>
                          <p className="text-sm text-gray-600">{item.customerPhone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={`${getSourceColor(item.source)} border`}>
                          <div className="flex items-center gap-1">
                            {getSourceIcon(item.source)}
                            {getSourceText(item.source)}
                          </div>
                        </Badge>
                        
                        <Badge className="bg-gray-100 text-gray-600 border border-gray-200">
                          <Calendar className="h-3 w-3 ml-1" />
                          {new Date(item.createdAt).toLocaleDateString("ar-EG", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-700">التقييم:</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < item.rating 
                                  ? "text-yellow-400 fill-current" 
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 mr-1">
                            ({item.rating}/5)
                          </span>
                        </div>
                      </div>
                    </div>

                    {item.reason ? (
                      <div className="bg-white p-4 rounded-lg border border-red-200">
                        <p className="text-sm font-medium text-gray-700 mb-1">سبب عدم الرضا:</p>
                        <p className="text-gray-900">{item.reason}</p>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          لم يتم تقديم سبب محدد - يمكن التواصل مع العميل لمعرفة التفاصيل
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 ml-1" />
                        متابعة
                      </Button>
                      <Button variant="outline" size="sm">
                        تم الحل
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        {feedback.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">تحليل الأسباب</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    مراجعة الأسباب الأكثر تكراراً للتقييمات السلبية
                  </p>
                  <Button variant="outline" className="w-full">
                    عرض التحليل التفصيلي
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Link to="/dashboard/customers" className="block">
              <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">إرسال استطلاع متابعة</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      التواصل مع العملاء الغير راضين لتحسين الخدمة
                    </p>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      إرسال رسائل متابعة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
