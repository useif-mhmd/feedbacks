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
  Users,
  Target,
  Award,
  Zap,
  Heart,
  Star,
  TrendingUp,
  Shield,
  Clock,
  Globe,
  BarChart,
  LayoutDashboard,
  ThumbsUp,
  Settings,
  Smartphone,
  Cloud,
  Lock,
  BarChart2,
  PieChart,
  Activity,
  Lightbulb,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 font-arabic">
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
              <Link to="/about" className="text-blue-600 font-medium relative">
                من نحن
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
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
              <Link to="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  تسجيل الدخول
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden" dir="rtl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-fadeInUp animation-delay-300">
              <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100 transform transition-all duration-300 hover:scale-105">
                🚀 نحو مستقبل أفضل لخدمة العملاء
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fadeInUp animation-delay-500">
              نحن نؤمن بقوة
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                تقييمات العملاء
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto animate-fadeInUp animation-delay-700">
              منصة تقييم العملاء هي نتاج شغف فريق من المطورين والمتخصصين في
              تجربة العملاء، نسعى لمساعدة المؤسسات على فهم عملائها بشكل أفضل
              وتحسين خدماتها باستمرار
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp animation-delay-900">
              <Link to="/pricing">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  اكتشف خططنا
                  <ArrowLeft className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                number: "500+",
                label: "مؤسسة تثق بنا",
                color: "text-blue-600",
                bg: "bg-blue-100",
              },
              {
                icon: Star,
                number: "50K+",
                label: "تقييم تم جمعه",
                color: "text-yellow-600",
                bg: "bg-yellow-100",
              },
              {
                icon: TrendingUp,
                number: "95%",
                label: "معدل رضا العملاء",
                color: "text-green-600",
                bg: "bg-green-100",
              },
              {
                icon: Globe,
                number: "15+",
                label: "دولة حول العالم",
                color: "text-purple-600",
                bg: "bg-purple-100",
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 group animate-fadeInUp"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`${stat.bg} ${stat.color} p-4 rounded-full w-fit mx-auto mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}
                  >
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section
        className="py-20 bg-gradient-to-r from-gray-50 to-blue-50"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fadeInUp">
              قيمنا ورؤيتنا
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fadeInUp animation-delay-300">
              نؤمن بأن كل رأي عميل هو فرصة للنمو والتطوير
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "الرؤية",
                description:
                  "نسعى لأن نكون المنصة الرائدة عالمياً في مجال تقييمات العملاء والتحليل الذكي للبيانات",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Heart,
                title: "الرسالة",
                description:
                  "تمكين المؤسسات من فهم عملائها بعمق وتحسين خدماتها لتحقيق أعلى معدلات الرضا والولاء",
                color: "from-pink-500 to-red-500",
              },
              {
                icon: Zap,
                title: "القيم",
                description:
                  "الابتكار، الشفافية، التميز في الخدمة، والالتزام بتحقيق النجاح المستدام لعملائنا",
                color: "from-yellow-500 to-orange-500",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group animate-fadeInUp"
                style={{ animationDelay: `${index * 300}ms` }}
              >
                <CardHeader className="text-center">
                  <div
                    className={`bg-gradient-to-r ${value.color} p-4 rounded-full w-fit mx-auto mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}
                  >
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed text-center">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fadeInUp">
              مميزات منصتنا
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fadeInUp animation-delay-300">
              حلول متكاملة لتحليل وتطوير تجربة العملاء
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart,
                title: "لوحة تحكم متطورة",
                description:
                  "لوحة تحكم تفاعلية تمكنك من متابعة جميع التقييمات والتحليلات في مكان واحد",
                color: "from-blue-500 to-indigo-500",
              },
              {
                icon: ThumbsUp,
                title: "تحليل المشاعر",
                description:
                  "تكنولوجيا الذكاء الاصطناعي لتحليل مشاعر العملاء وتصنيف التقييمات تلقائياً",
                color: "from-green-500 to-teal-500",
              },
              {
                icon: Smartphone,
                title: "تعدد القنوات",
                description:
                  "جمع التقييمات عبر واتساب، البريد الإلكتروني، الرسائل القصيرة، والمزيد",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: PieChart,
                title: "تقارير ذكية",
                description:
                  "تقارير مفصلة مع رسومات بيانية توضح نقاط القوة والضعف في خدماتك",
                color: "from-red-500 to-orange-500",
              },
              {
                icon: Activity,
                title: "مؤشرات الأداء",
                description:
                  "تتبع مؤشرات الأداء الرئيسية (KPIs) لقياس تقدمك في تحسين تجربة العملاء",
                color: "from-yellow-500 to-amber-500",
              },
              {
                icon: Lightbulb,
                title: "اقتراحات التحسين",
                description:
                  "اقتراحات ذكية بناءً على تحليل التقييمات لمساعدتك في اتخاذ قرارات أفضل",
                color: "from-cyan-500 to-blue-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 group animate-fadeInUp"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardHeader className="text-center">
                  <div
                    className={`bg-gradient-to-r ${feature.color} p-4 rounded-full w-fit mx-auto mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
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

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fadeInUp">
              كيف تعمل المنصة؟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fadeInUp animation-delay-300">
              رحلة بسيطة لتحقيق نتائج استثنائية
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {[
              {
                step: "1",
                icon: Settings,
                title: "التكوين السهل",
                description: "قم بإعداد استبيان التقييم الخاص بك في دقائق معدودة",
                color: "bg-blue-100 text-blue-600",
              },
              {
                step: "2",
                icon: Smartphone,
                title: "نشر الاستبيان",
                description: "أرسل الاستبيان لعملائك عبر القنوات المتعددة",
                color: "bg-purple-100 text-purple-600",
              },
              {
                step: "3",
                icon: BarChart2,
                title: "تحليل البيانات",
                description: "استقبل التقييمات واترك المنصة تحللها تلقائياً",
                color: "bg-green-100 text-green-600",
              },
              {
                step: "4",
                title: "التقارير والتحسين",
                icon: Lightbulb,
                description: "استلم تقارير مفصلة وابدأ في تحسين خدماتك",
                color: "bg-yellow-100 text-yellow-600",
              },
            ].map((step, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center animate-fadeInUp"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${step.color}`}>
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="w-12 h-12 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center mb-4 text-blue-600 font-bold text-xl">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fadeInUp">
              الأمان والخصوصية
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fadeInUp animation-delay-300">
              نحمي بياناتك بتقنيات متقدمة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "تشفير البيانات",
                description:
                  "جميع البيانات مشفرة باستخدام تقنيات تشفير متقدمة (AES-256)",
                color: "text-blue-600",
                bg: "bg-blue-100",
              },
              {
                icon: Cloud,
                title: "نسخ احتياطية",
                description:
                  "نسخ احتياطية يومية تضمن عدم فقدان أي بيانات مهما حدث",
                color: "text-green-600",
                bg: "bg-green-100",
              },
              {
                icon: Lock,
                title: "صلاحيات التحكم",
                description:
                  "إدارة صلاحيات دقيقة للتحكم في من يمكنه الوصول إلى البيانات",
                color: "text-purple-600",
                bg: "bg-purple-100",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 group animate-fadeInUp"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6 flex items-start">
                  <div
                    className={`${feature.bg} ${feature.color} p-3 rounded-lg mr-4 transform transition-all duration-300 group-hover:scale-110`}
                  >
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
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
            جاهز لتحسين تجربة عملائك؟
          </h3>
          <p className="text-xl text-blue-100 mb-8 animate-fadeInUp animation-delay-300">
            ابدأ رحلتك معنا اليوم واكتشف كيف يمكن لتقييمات العملاء أن تغير
            مؤسستك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp animation-delay-500">
            <Link to="/login">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                ابدأ تجربتك المجانية
                <ArrowLeft className="h-5 w-5 mr-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-black hover:bg-white hover:text-blue-600 text-lg px-8 py-6 transform transition-all duration-300 hover:scale-105"
              >
                تحدث مع خبرائنا
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
                نحو مستقبل أفضل لخدمة العملاء من خلال التقنيات الحديثة والابتكار
                المستمر
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