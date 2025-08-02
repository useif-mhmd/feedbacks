import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Mail,
  Smartphone,
  BarChart3,
  Star,
  Users,
  Zap,
  Check,
  ArrowLeft,
  TrendingUp,
  Shield,
  Clock,
  Target,
  Award,
  PlayCircle,
  ChevronRight,
  Sparkles,
  ChevronDown,
  Heart,
  HelpCircle,
  ThumbsUp,
  Hotel,
  ShoppingBag,
  Car,
  Stethoscope,
  Utensils,
  Banknote,
  UserCheck,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";

export default function Index() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 font-arabic overflow-hidden">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 rtl:space-x-reverse group">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md">
                <MessageCircle className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                منصة تقييم العملاء
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              <Link to="/" className="text-blue-600 font-medium relative group">
                الرئيسية
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full transform origin-left scale-x-100 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105"
              >
                من نحن
              </Link>
              <Link
                to="/pricing"
                className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105"
              >
                الأسعار
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105"
              >
                تواصل معنا
              </Link>
              <div className="flex items-center gap-3">
                <Link to="/register">
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 transform transition-all duration-300 hover:scale-105">
                    إنشاء حساب
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg group text-white">
                    تسجيل الدخول
                    <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative pt-20 pb-16 text-center overflow-hidden"
        dir="rtl"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce animation-delay-1000"></div>
          <div className="absolute top-40 left-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-bounce animation-delay-2000"></div>
          <div className="absolute bottom-20 right-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-bounce animation-delay-3000"></div>
          <div className="absolute bottom-1/3 left-1/4 w-10 h-10 bg-indigo-200 rounded-full opacity-20 animate-bounce animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-fadeInUp animation-delay-300">
              <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:from-blue-200 hover:to-purple-200 transform transition-all duration-500 hover:scale-110 border-0 shadow-lg">
                <Sparkles className="h-4 w-4 ml-2" />
                🚀 منصة أتمتة تقييمات العملاء
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-fadeInUp animation-delay-500">
              اجمع تقييمات عملائك
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                بطريقة ذكية وآلية
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto animate-fadeInUp animation-delay-700">
              منصة متطورة تتيح لك إرسال رسائل مخصصة لعملائك عبر واتساب والإيميل
              و SMS لجمع تقييماتهم وتحليلها تلقائياً لتحسين خدماتك وزيادة رضا
              العملاء
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp animation-delay-900">
              <Link to="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6 transform transition-all duration-500 hover:scale-110 hover:shadow-2xl group border-0 text-white"
                >
                  ابدأ الآن مجاناً
                  <ArrowLeft className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:translate-x-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg group border-gray-300 bg-white/80"
              >
                <PlayCircle className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:scale-110" />
                شاهد العرض التوضيحي
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 animate-fadeInUp animation-delay-1200">
              {[
                { number: "500+", label: "مؤسسة تثق بنا", icon: <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" /> },
                { number: "50K+", label: "تقييم تم جمعه", icon: <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" /> },
                { number: "95%", label: "معدل رضا العملاء", icon: <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" /> },
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  {stat.icon}
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 transform transition-all duration-300 group-hover:scale-110">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 animate-fadeInUp">
              مميزات المنصة
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fadeInUp animation-delay-300">
              حلول متكاملة لإدارة تقييمات العملاء بطريقة احترافية وفعالة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: "إرسال عبر واتساب",
                description:
                  "ربط مباشر مع واتساب لإرسال رسائل تقييم مخصصة لعملائك مع معالجة الردود تلقائياً",
                color: "from-green-500 to-green-600",
                bg: "bg-green-50",
              },
              {
                icon: Mail,
                title: "البريد الإلكتروني",
                description:
                  "إرسال إيميلات احترافية بقوالب HTML جاهزة لجمع التقييمات مع ردود ذكية",
                color: "from-blue-500 to-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Smartphone,
                title: "رسائل SMS",
                description:
                  "إرسال رسائل نصية سريعة ومباشرة لطلب تقييمات العملاء بطريقة فعالة",
                color: "from-purple-500 to-purple-600",
                bg: "bg-purple-50",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:rotate-1 group animate-fadeInUp bg-white"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardHeader className="text-center">
                  <div
                    className={`bg-gradient-to-r ${feature.color} p-4 rounded-2xl w-fit mx-auto mb-4 transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 shadow-lg`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        className="py-20 bg-gradient-to-r from-gray-50 to-blue-50 relative overflow-hidden"
        dir="rtl"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <Badge className="mb-6 bg-blue-100 text-blue-700 border-0 shadow">
                💡 لماذا تختار منصتنا؟
              </Badge>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                حلول ذكية لتحسين
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {" "}
                  تجربة العملاء
                </span>
              </h3>

              <div className="space-y-6">
                {[
                  {
                    icon: Zap,
                    title: "أتمتة كاملة",
                    description:
                      "إرسال وتحليل التقييمات تلقائياً دون تدخل يدوي مع ردود ذكية",
                  },
                  {
                    icon: BarChart3,
                    title: "تحليل ذكي",
                    description:
                      "فرز التقييمات تلقائياً وتوجيه العملاء المناسب حسب درجة الرضا",
                  },
                  {
                    icon: Users,
                    title: "إدارة شاملة",
                    description:
                      "لوحة تحكم متكاملة لمتابعة جميع التقييمات والتفاعل مع العملاء",
                  },
                  {
                    icon: Shield,
                    title: "أمان وموثوقية",
                    description:
                      "حماية متقدمة للبيانات مع ضمان الخصوصية والامتثال للمعا��ير",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div
                      className={`bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-xl flex-shrink-0 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg`}
                    >
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-fadeInUp animation-delay-500">
              <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-2xl w-fit mx-auto mb-4 transform hover:scale-110 transition-all duration-300 shadow-lg">
                      <Star className="h-12 w-12 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900">
                      تقييمات إيجابية
                    </h4>
                    <p className="text-gray-600">
                      العملاء الذين قيموا بـ 4-5 نجوم
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      "يتم توجيههم لـ Google Maps",
                      "تحسين سمعة المؤسسة",
                      "زيادة المراجعات الإيجابية",
                      "تعزيز الثقة بالعلامة التجارية",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between group"
                      >
                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                          {item}
                        </span>
                        <div className="bg-green-100 text-green-600 p-1 rounded-full transform group-hover:scale-110 transition-all duration-300">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white relative overflow-hidden" dir="rtl">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 animate-fadeInUp">
              كيف يعمل النظام؟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fadeInUp animation-delay-300">
              خطوات بسيطة للبدء في جمع تقييمات عملائك بطريقة احترافية
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "ارفع بيانات العملاء",
                description: "ارفع ملف Excel بأرقام العملاء وإيميلاتهم",
                icon: Users,
              },
              {
                step: "2",
                title: "اختر طريقة الإرسال",
                description: "واتساب، إيميل، أو SMS حسب تفضيلك",
                icon: MessageCircle,
              },
              {
                step: "3",
                title: "إرسال تلقائي",
                description: "النظام يرسل الرسائل تلقائياً لجميع العملاء",
                icon: Zap,
              },
              {
                step: "4",
                title: "تحليل النتائج",
                description: "احصل على تقارير مفصلة وتحليل ذكي",
                icon: BarChart3,
              },
            ].map((step, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 group text-center animate-fadeInUp bg-white"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6">
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg">
                      <step.icon className="h-8 w-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 animate-fadeInUp">
              القطاعات التي نخدمها
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fadeInUp animation-delay-300">
              حلولنا تناسب مختلف أنواع المؤسسات والشركات
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "المطاعم والمقاهي", icon: Utensils, color: "bg-red-100 text-red-600" },
              { name: "الخدمات الطبية", icon: Stethoscope, color: "bg-blue-100 text-blue-600" },
              { name: "التجزئة", icon: ShoppingBag, color: "bg-amber-100 text-amber-600" },
              { name: "الفنادق", icon: Hotel, color: "bg-cyan-100 text-cyan-600" },
              { name: "الخدمات المالية", icon: Banknote, color: "bg-green-100 text-green-600" },
              { name: "الخدمات المهنية", icon: UserCheck, color: "bg-purple-100 text-purple-600" },
            ].map((industry, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 flex flex-col items-center justify-center text-center border border-gray-100"
              >
                <div className={`${industry.color} p-3 rounded-full mb-4`}>
                  <industry.icon className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-gray-800">{industry.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 animate-fadeInUp">
              الأسئلة الشائعة
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fadeInUp animation-delay-300">
              أجوبة على أكثر الاستفسارات شيوعاً من عملائنا
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "هل يمكنني تجربة المنصة قبل الاشتراك؟",
                answer: "نعم، نقدم نسخة تجريبية مجانية لمدة 14 يوم��ا تمكنك من اختبار جميع الميزات دون الحاجة إلى بطاقة ائتمان."
              },
              {
                question: "ما هي طرق الدفع المتاحة؟",
                answer: "نقبل جميع البطاقات الائتمانية الرئيسية بالإضافة إلى التحويلات البنكية. كما يمكنك الدفع عبر بوابات الدفع الإلكترونية مثل PayPal وStripe."
              },
              {
                question: "هل المنصة متوافقة مع جميع الأجهزة؟",
                answer: "نعم، تم تصميم المنصة لتكون متجاوبة مع جميع الأجهزة بما في ذلك أجهزة الكمبيوتر والأجهزة اللوحية والهواتف الذكية."
              },
              {
                question: "كيف أضمن خصوصية بيانات عملائي؟",
                answer: "نحن نلتزم بأعلى معايير الأمان والخصوصية. جميع البيانات مشفرة أثناء النقل والتخزين، ونحن نلتزم باللوائح المحلية والدولية لحماية البيانات."
              },
              {
                question: "هل يمكنني تصدير التقارير من المنصة؟",
                answer: "نعم، يمكنك تصدير التقارير بتنسيقات مختلفة مثل PDF وExcel وCSV لمشاركتها مع فريقك أو لاستخدامها في تحليلات إضافية."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <button
                  className="flex items-center justify-between w-full p-5 text-right bg-white hover:bg-gray-50 transition-colors duration-300"
                  onClick={() => toggleQuestion(index)}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium text-gray-800">{faq.question}</h3>
                  </div>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${activeQuestion === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {activeQuestion === index && (
                  <div className="p-5 bg-gray-50 border-t border-gray-200 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              شركاء النجاح
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نفتخر بالعمل مع أفضل المؤسسات والعلامات التجارية
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-28 transition-all duration-300 hover:shadow-lg hover:border-blue-500 border-2 border-gray-100"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden"
        dir="rtl"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90"></div>

        {/* Animated elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/4 left-1/3 w-20 h-20 bg-white/10 rounded-full animate-pulse animation-delay-1500"></div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-fadeInUp">
            ابدأ في جمع تقييمات عملائك اليوم
          </h3>
          <p className="text-xl text-blue-100 mb-8 animate-fadeInUp animation-delay-300">
            انضم لمئات المؤسسات التي تستخدم منصتنا لتحسين خدماتها وزيادة رضا
            العملاء
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp animation-delay-500">
            <Link to="/login">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 transform transition-all duration-500 hover:scale-110 hover:shadow-2xl group border-0"
              >
                ابدأ تجربتك المجانية الآن
                <ArrowLeft className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:translate-x-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-black hover:bg-white hover:text-blue-600 text-lg px-8 py-6 transform transition-all duration-300 hover:scale-105 group"
              >
                تحدث مع خبير
                <ChevronRight className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="animate-fadeInUp">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4 group">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold group-hover:text-blue-400 transition-colors duration-300">
                  منصة تقييم العملاء
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                الحل الأمثل لأتمتة جمع وتحليل تقييمات العملاء بطريقة ذكية
                ومتطورة
              </p>
            </div>

            <div className="animate-fadeInUp animation-delay-200">
              <h4 className="font-semibold mb-4 text-blue-400">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/"
                    className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform flex items-center gap-2"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform flex items-center gap-2"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform flex items-center gap-2"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    الأسعار
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform flex items-center gap-2"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    تواصل معنا
                  </Link>
                </li>
              </ul>
            </div>

            <div className="animate-fadeInUp animation-delay-400">
              <h4 className="font-semibold mb-4 text-purple-400">المميزات</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  إرسال عبر واتساب
                </li>
                <li className="hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  البريد الإلكتروني
                </li>
                <li className="hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  رسائل SMS
                </li>
                <li className="hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  تحليل ذكي
                </li>
              </ul>
            </div>

            <div className="animate-fadeInUp animation-delay-600">
              <h4 className="font-semibold mb-4 text-green-400">الدعم</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  مركز المساعدة
                </li>
                <li className="hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  التوثيق
                </li>
                <li className="hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  الدعم الفني
                </li>
                <li className="hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  الأسئلة الشائعة
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 animate-fadeInUp animation-delay-800 flex flex-col md:flex-row justify-between items-center">
            <p className="hover:text-white transition-colors duration-300 mb-4 md:mb-0">
              &copy; 2024 منصة تقييم العملاء. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <div className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </div>
              <div className="bg-gray-800 p-2 rounded-full hover:bg-blue-400 transition-colors duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </div>
              <div className="bg-gray-800 p-2 rounded-full hover:bg-red-600 transition-colors duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          40%,
          43% {
            transform: translate3d(0, -30px, 0);
          }
          70% {
            transform: translate3d(0, -15px, 0);
          }
          90% {
            transform: translate3d(0, -4px, 0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-700 {
          animation-delay: 700ms;
        }

        .animation-delay-800 {
          animation-delay: 800ms;
        }

        .animation-delay-900 {
          animation-delay: 900ms;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .animation-delay-1200 {
          animation-delay: 1200ms;
        }

        .animation-delay-1500 {
          animation-delay: 1500ms;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }

        .animation-delay-3000 {
          animation-delay: 3000ms;
        }

        .animation-delay-4000 {
          animation-delay: 4000ms;
        }
      `}</style>
    </div>
  );
}
