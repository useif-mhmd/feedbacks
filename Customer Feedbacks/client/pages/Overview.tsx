import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/use-api";
import {
  BarChart3,
  Users,
  MessageCircle,
  Star,
  TrendingUp,
  Calendar,
  Activity,
  ThumbsUp,
  ThumbsDown,
  Mail,
  Smartphone,
  Target,
  ArrowUpRight,
  Eye,
  Clock,
} from "lucide-react";

interface StatsData {
  totalMessages: number;
  messagesSentThisMonth: number;
  totalResponses: number;
  responsesThisMonth: number;
  positiveRatings: number;
  negativeRatings: number;
  averageRating: number;
  totalCustomers: number;
  customersThisMonth: number;
  responseRate: number;
  sourceBreakdown: {
    whatsapp: number;
    email: number;
    sms: number;
  };
  monthlyTrend: Array<{
    month: string;
    messages: number;
    responses: number;
    positiveRatings: number;
  }>;
}

export default function Overview() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get("/api/stats/overview");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-arabic flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الإحصائيات...</p>
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
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">الإحصائيات العامة</h1>
                <p className="text-sm text-gray-600">لوحة التحكم الرئيسية</p>
              </div>
            </div>

            <nav className="flex items-center space-x-4 rtl:space-x-reverse">
              <Link to="/dashboard/overview" className="text-blue-600 font-medium">
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
              <Link to="/dashboard/email-test" className="text-gray-600 hover:text-blue-600">
                اختبار الإيميل
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">مرحباً بك! 👋</h2>
          <p className="text-gray-600">إليك نظرة سريعة على أداء منصتك خلال الفترة الأخيرة</p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                الرسائل هذا الشهر
              </CardTitle>
              <MessageCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {stats?.messagesSentThisMonth || 0}
              </div>
              <p className="text-xs text-blue-600 mt-1">
                من إجمالي {stats?.totalMessages || 0} رسالة
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                الردود هذا الشهر
              </CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {stats?.responsesThisMonth || 0}
              </div>
              <p className="text-xs text-green-600 mt-1">
                معدل الاستجابة {stats?.responseRate || 0}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">
                تقييمات إيجابية
              </CardTitle>
              <ThumbsUp className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">
                {stats?.positiveRatings || 0}
              </div>
              <p className="text-xs text-yellow-600 mt-1">
                4-5 نجوم
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">
                تقييمات سلبية
              </CardTitle>
              <ThumbsDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">
                {stats?.negativeRatings || 0}
              </div>
              <p className="text-xs text-red-600 mt-1">
                1-3 نجوم
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Response Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                مصادر الردود
              </CardTitle>
              <CardDescription>
                توزيع الردود حسب قناة التواصل
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <span>واتساب</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{stats?.sourceBreakdown.whatsapp || 0}</span>
                    <Badge className="bg-green-100 text-green-800">
                      {stats?.totalResponses ? Math.round((stats.sourceBreakdown.whatsapp / stats.totalResponses) * 100) : 0}%
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>البريد الإلكتروني</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{stats?.sourceBreakdown.email || 0}</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {stats?.totalResponses ? Math.round((stats.sourceBreakdown.email / stats.totalResponses) * 100) : 0}%
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-purple-600" />
                    <span>SMS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{stats?.sourceBreakdown.sms || 0}</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      {stats?.totalResponses ? Math.round((stats.sourceBreakdown.sms / stats.totalResponses) * 100) : 0}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Growth */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                نمو قاعدة العملاء
              </CardTitle>
              <CardDescription>
                إجمالي العملاء والإضافات الجديدة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>إجمالي العملاء</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {stats?.totalCustomers || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>عملاء جدد هذا الشهر</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-green-600">
                      +{stats?.customersThisMonth || 0}
                    </span>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>متوسط التقييم</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-bold text-yellow-600">
                      {stats?.averageRating?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" />
              إجراءات سريعة
            </CardTitle>
            <CardDescription>
              الوصول السريع للمهام الشائعة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link 
                to="/dashboard/whatsapp" 
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-blue-600">
                      ربط واتساب
                    </p>
                    <p className="text-sm text-gray-600">إعداد الاتصال</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                </div>
              </Link>
              
              <Link 
                to="/dashboard/customers" 
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-blue-600">
                      رفع عملاء
                    </p>
                    <p className="text-sm text-gray-600">إضافة ملف Excel</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                </div>
              </Link>
              
              <Link 
                to="/dashboard/feedback" 
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-blue-600">
                      التقييمات السلبية
                    </p>
                    <p className="text-sm text-gray-600">متابعة الشكاوى</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                </div>
              </Link>
              
              <Link 
                to="/dashboard/settings" 
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-blue-600">
                      إعدادات الإيمي��
                    </p>
                    <p className="text-sm text-gray-600">SMTP</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
