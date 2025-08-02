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
  ArrowLeft,
  Check,
  Star,
  Zap,
  Crown,
  Rocket,
  Users,
  Mail,
  Smartphone,
  BarChart3,
  Shield,
  Clock,
  Headphones,
} from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "المجاني",
      price: "0",
      period: "دائماً",
      description: "مثالي للشركات الناشئة والاختبار",
      icon: Star,
      color: "from-gray-500 to-gray-600",
      popular: false,
      features: [
        "حتى 100 عميل شهرياً",
        "إرسال عبر قناة واحدة",
        "تقارير أساسية",
        "دعم بالإيميل",
        "قوالب رسائل جاهزة",
      ],
      limitations: ["بدون معالجة ردود تلقائية", "بدون تخصيص متقدم"],
    },
    {
      name: "المحترف",
      price: "299",
      period: "شهرياً",
      description: "الأفضل للشركات المتوسطة",
      icon: Zap,
      color: "from-blue-500 to-blue-600",
      popular: true,
      features: [
        "حتى 1000 عميل شهرياً",
        "جميع قنوات الإرسال",
        "معالجة ردود تلقائية",
        "تقارير متقدمة وتحليلات",
        "تخصيص كامل للرسائل",
        "دعم أولوية",
        "تكامل Google Maps",
        "إدارة التقييمات السلبية",
      ],
      limitations: [],
    },
    {
      name: "المؤسسات",
      price: "999",
      period: "شهرياً",
      description: "للمؤسسات الكبيرة والمتطلبات الخاصة",
      icon: Crown,
      color: "from-purple-500 to-purple-600",
      popular: false,
      features: [
        "عملاء غير محدود",
        "جميع المميزات المتقدمة",
        "تكامل API مخصص",
        "تحليلات BI متقدمة",
        "مدير حساب مخصص",
        "دعم 24/7",
        "تدريب الفريق",
        "تخصيص كامل للمنصة",
        "نسخ احتياطية متقدمة",
        "أمان مؤسسي",
      ],
      limitations: [],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-arabic">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 rtl:space-x-reverse group">
              <div className="bg-blue-600 text-white p-2 rounded-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <MessageCircle className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                منصة تقييم العملاء
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105"
              >
                الرئيسية
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105"
              >
                من نحن
              </Link>
              <Link
                to="/pricing"
                className="text-blue-600 font-medium relative"
              >
                الأسعار
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105"
              >
                تواصل معنا
              </Link>
              <Link to="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  تسجيل الدخول
                  <ArrowLeft className="h-4 w-4 mr-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden" dir="rtl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fadeInUp animation-delay-300">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100 transform transition-all duration-300 hover:scale-105">
              💎 خطط مرنة تناسب جميع الأحجام
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fadeInUp animation-delay-500">
            اختر الخطة المناسبة
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              لنمو مؤسستك
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto animate-fadeInUp animation-delay-700">
            خطط مصممة بعناية لتلبي احتياجات مؤسستك مهما كان حجمها، مع إمكانية
            الترقية في أي وقت
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp animation-delay-900">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              جرب مجاناً لـ 14 يوم
              <ArrowLeft className="h-5 w-5 mr-2" />
            </Button>
            <p className="text-sm text-gray-500">بدون الحاجة لكارت ائتماني</p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group animate-fadeInUp ${
                  plan.popular ? "ring-2 ring-blue-500 scale-105" : ""
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1 text-sm font-medium">
                      الأكثر شعبية ⭐
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div
                    className={`bg-gradient-to-r ${plan.color} p-4 rounded-full w-fit mx-auto mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}
                  >
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    {plan.description}
                  </CardDescription>

                  <div className="mt-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-lg font-medium text-gray-500 mr-2">
                        ر.س
                      </span>
                      <span className="text-sm text-gray-500">
                        / {plan.period}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className="bg-green-100 text-green-600 p-1 rounded-full flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <li
                        key={limitIndex}
                        className="flex items-start gap-3 opacity-50"
                      >
                        <div className="bg-gray-100 text-gray-400 p-1 rounded-full flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-gray-500 text-sm line-through">
                          {limitation}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/login">
                    <Button
                      className={`w-full py-6 text-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        plan.popular
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                    >
                      {plan.price === "0" ? "ابدأ مجاناً" : "اختر هذه الخطة"}
                      <ArrowLeft className="h-5 w-5 mr-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fadeInUp">
              مقارنة شاملة للمميزات
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fadeInUp animation-delay-300">
              تفاصيل كاملة لما تحصل عليه في كل خطة
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-4 px-6 font-semibold text-gray-900">
                    المميزات
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">
                    المجاني
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-blue-600">
                    المحترف
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-purple-600">
                    المؤسسات
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "عدد العملاء الشهري",
                    free: "100",
                    pro: "1,000",
                    enterprise: "غير محدود",
                  },
                  {
                    feature: "قنوات الإرسال",
                    free: "1",
                    pro: "جميع القنوات",
                    enterprise: "جميع القنوات + مخصص",
                  },
                  {
                    feature: "معالجة الردود التلقائية",
                    free: "❌",
                    pro: "✅",
                    enterprise: "✅",
                  },
                  {
                    feature: "تقارير وتحليلات",
                    free: "أساسية",
                    pro: "متقدمة",
                    enterprise: "BI متقدم",
                  },
                  {
                    feature: "تخصيص الرسائل",
                    free: "محدود",
                    pro: "كامل",
                    enterprise: "كامل + AI",
                  },
                  {
                    feature: "الدعم الفني",
                    free: "إيميل",
                    pro: "أولوية",
                    enterprise: "24/7 مخصص",
                  },
                  {
                    feature: "API وتكاملات",
                    free: "❌",
                    pro: "محدود",
                    enterprise: "كامل",
                  },
                  {
                    feature: "أمان وخصوصية",
                    free: "أساسي",
                    pro: "متقدم",
                    enterprise: "مؤسسي",
                  },
                ].map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 text-center text-gray-600">
                      {row.free}
                    </td>
                    <td className="py-4 px-6 text-center text-blue-600 font-medium">
                      {row.pro}
                    </td>
                    <td className="py-4 px-6 text-center text-purple-600 font-medium">
                      {row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fadeInUp">
              أسئلة شائعة
            </h2>
            <p className="text-xl text-gray-600 animate-fadeInUp animation-delay-300">
              إجابات على الأسئلة الأكثر شيوعاً حول خططنا
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "هل يمكنني تغيير الخطة في أي وقت؟",
                answer:
                  "نعم، يمكنك الترقية أو التنزيل في أي وقت. التغييرات تطبق فوراً ونحاسبك بالتناسب.",
              },
              {
                question: "ما هي طرق الدفع المتاحة؟",
                answer:
                  "نقبل جميع البطاقات الائتمانية الرئيسية، التحويل البنكي، وبطاقات مدى للعملاء في السعودية.",
              },
              {
                question: "هل توجد رسوم إضافية؟",
                answer:
                  "لا، جميع الأسعار شاملة. لا توجد رسوم خفية أو رسوم إعداد أو رسوم إلغاء.",
              },
              {
                question: "ماذا يحدث إذا تجاوزت حد العملاء؟",
                answer:
                  "سنتواصل معك لترقية خطتك. لن نوقف خدمتك ولكن قد نطبق رسوم إضافية بسيطة.",
              },
              {
                question: "هل البيانات آمنة ومحمية؟",
                answer:
                  "نعم، نستخدم أعلى معايير الأمان مع تشفير SSL وحماية متقدمة للبيانات.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden"
        dir="rtl"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fadeInUp">
            ابدأ رحلتك معنا اليوم
          </h3>
          <p className="text-xl text-blue-100 mb-8 animate-fadeInUp animation-delay-300">
            جرب منصتنا مجاناً لمدة 14 يوم واكتشف كيف يمكن تحسين تجربة عملائك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp animation-delay-500">
            <Link to="/login">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                ابدأ التجربة المجانية
                <ArrowLeft className="h-5 w-5 mr-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-black hover:bg-white hover:text-blue-600 text-lg px-8 py-6 transform transition-all duration-300 hover:scale-105"
              >
                تحدث مع المبيعات
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
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold">منصة تقييم العملاء</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                خطط مرنة ومناسبة لجميع أحجام المؤسسات
              </p>
            </div>

            <div className="animate-fadeInUp animation-delay-200">
              <h4 className="font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors"
                  >
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    الأسعار
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors"
                  >
                    تواصل معنا
                  </Link>
                </li>
              </ul>
            </div>

            <div className="animate-fadeInUp animation-delay-400">
              <h4 className="font-semibold mb-4">المميزات</h4>
              <ul className="space-y-2 text-gray-400">
                <li>إرسال عبر واتساب</li>
                <li>البريد الإلكتروني</li>
                <li>رسائل SMS</li>
                <li>تحليل ذكي</li>
              </ul>
            </div>

            <div className="animate-fadeInUp animation-delay-600">
              <h4 className="font-semibold mb-4">الدعم</h4>
              <ul className="space-y-2 text-gray-400">
                <li>مركز المساعدة</li>
                <li>التوثيق</li>
                <li>الدعم الفني</li>
                <li>الأسئلة الشائعة</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 animate-fadeInUp animation-delay-800">
            <p>&copy; 2024 منصة تقييم العملاء. جميع الحقوق محفوظة.</p>
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

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
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
      `}</style>
    </div>
  );
}
