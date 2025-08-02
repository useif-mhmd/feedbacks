import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircle,
  ArrowLeft,
  Send,
  Mail,
  Phone,
  MapPin,
  Clock,
  Users,
  Headphones,
  Zap,
  Star,
  CheckCircle,
} from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "تم إرسال رسالتك بنجاح! ✅",
        description: "سنتواصل معك خلال 24 ساعة",
      });
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 font-arabic">
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
                className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105"
              >
                الأسعار
              </Link>
              <Link
                to="/contact"
                className="text-blue-600 font-medium relative"
              >
                تواصل معنا
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-green-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fadeInUp animation-delay-300">
            <Badge className="mb-6 bg-green-100 text-green-700 hover:bg-green-100 transform transition-all duration-300 hover:scale-105">
              💬 نحن هنا لمساعدتك
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fadeInUp animation-delay-500">
            تواصل معنا
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              نحن هنا لخدمتك
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto animate-fadeInUp animation-delay-700">
            فريقنا من الخبراء جاهز لمساعدتك في أي استفسار أو طلب دعم. تواصل معنا
            بالطريقة التي تناسبك
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20 bg-white" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: Mail,
                title: "البريد الإلكتروني",
                description: "support@feedback-platform.com",
                subtitle: "رد خلال 2-4 ساعات",
                color: "from-blue-500 to-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Phone,
                title: "الهاتف",
                description: "+966 50 123 4567",
                subtitle: "الأحد - الخميس 9ص - 6م",
                color: "from-green-500 to-green-600",
                bg: "bg-green-50",
              },
              {
                icon: MessageCircle,
                title: "الدردشة المباشرة",
                description: "متوفر على الموقع",
                subtitle: "استجابة فورية",
                color: "from-purple-500 to-purple-600",
                bg: "bg-purple-50",
              },
              {
                icon: MapPin,
                title: "العنوان",
                description: "الرياض، المملكة العربية السعودية",
                subtitle: "زيارة بموعد مسبق",
                color: "from-orange-500 to-orange-600",
                bg: "bg-orange-50",
              },
            ].map((contact, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 group animate-fadeInUp"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`bg-gradient-to-r ${contact.color} p-4 rounded-full w-fit mx-auto mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}
                  >
                    <contact.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {contact.title}
                  </h3>
                  <p className="text-gray-700 font-medium mb-1">
                    {contact.description}
                  </p>
                  <p className="text-sm text-gray-500">{contact.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section
        className="py-20 bg-gradient-to-r from-gray-50 to-blue-50"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <Card className="border-0 shadow-2xl animate-fadeInUp animation-delay-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Send className="h-6 w-6 text-blue-600" />
                  أرسل لنا رسالة
                </CardTitle>
                <CardDescription className="text-gray-600">
                  املأ النموذج وسنتواصل معك في أقرب وقت ممكن
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم الكامل *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="اكتب اسمك الكامل"
                        required
                        className="transition-all duration-300 focus:scale-105"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                        required
                        className="transition-all duration-300 focus:scale-105"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">اسم الشركة</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="شركتك أو مؤسستك"
                        className="transition-all duration-300 focus:scale-105"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+966 50 123 4567"
                        className="transition-all duration-300 focus:scale-105"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">موضوع الرسالة *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="ما موضوع استفسارك؟"
                      required
                      className="transition-all duration-300 focus:scale-105"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">تفاصيل الرسالة *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="اكتب تفاصيل استفسارك أو طلبك..."
                      rows={5}
                      required
                      className="transition-all duration-300 focus:scale-105"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                        ��اري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 ml-2" />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info */}
            <div className="space-y-8 animate-fadeInUp animation-delay-500">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  نحن هنا لمساعدتك
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  فريقنا من الخبراء المتخصصين جاهز للإجابة على جميع استفساراتك
                  ومساعدتك في الحصول على أقصى استفادة من منصتنا.
                </p>
              </div>

              <div className="grid gap-6">
                {[
                  {
                    icon: Headphones,
                    title: "دعم فني متخصص",
                    description:
                      "فريق دعم فني متاح للمساعدة في جميع الاستفسارات التقنية",
                  },
                  {
                    icon: Users,
                    title: "استشارات مجانية",
                    description:
                      "نقدم استشارات مجانية لمساعدتك في تحسين استراتيجية تقييم العملاء",
                  },
                  {
                    icon: Zap,
                    title: "استجابة سريعة",
                    description:
                      "نلتزم بالرد على جميع الاستفسارات خلال 24 ساعة كحد أقصى",
                  },
                ].map((feature, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-lg transform transition-all duration-300 group-hover:scale-110">
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">تحتاج مساعدة فورية؟</h3>
                  <p className="text-blue-100 text-sm mb-4">
                    تواصل معنا عبر الدردشة المباشرة للحصول على مساعدة فورية
                  </p>
                  <Button
                    variant="outline"
                    className="border-white text-black hover:bg-white hover:text-blue-600"
                  >
                    ابدأ الدردشة الآن
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fadeInUp">
              أسئلة شائعة
            </h2>
            <p className="text-xl text-gray-600 animate-fadeInUp animation-delay-300">
              إجابات سريعة على الأسئلة الأكثر شيوعاً
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "كم من الوقت يستغرق إعداد المنصة؟",
                answer:
                  "يمكن إعداد المنصة والبدء في استخدامها خلال 15 دقيقة فقط. فريقنا متاح لمساعدتك في الإعداد.",
              },
              {
                question: "هل توفرون تدريب للفريق؟",
                answer:
                  "نعم، نوفر تدريب شامل لفريقك مع جلسات تدريبية مباشرة ومواد تعليمية مفصلة.",
              },
              {
                question: "ما هي معدلات الاستجابة للدعم الفني؟",
                answer:
                  "نرد على الاستفسارات خلال 2-4 ساعات في المتوسط، والطوارئ خلال ساعة واحدة.",
              },
              {
                question: "هل يمكن تخصيص المنصة حسب احتياجاتنا؟",
                answer:
                  "بالطبع! نوفر تخصيص كامل للمنصة لتناسب احتياجات مؤسستك الخاصة.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
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
        className="py-20 bg-gradient-to-r from-blue-600 to-green-600 relative overflow-hidden"
        dir="rtl"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fadeInUp">
            جاهز للبدء؟
          </h3>
          <p className="text-xl text-blue-100 mb-8 animate-fadeInUp animation-delay-300">
            ابدأ رحلتك معنا اليوم واكتشف كيف يمكن تحسين تجربة عملائك
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
            <Link to="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-black hover:bg-white hover:text-blue-600 text-lg px-8 py-6 transform transition-all duration-300 hover:scale-105"
              >
                اعرف المزيد عن الأسعار
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
                نحن هنا لمساعدتك في تحقيق أفضل تجربة لعملائك
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
                <li>البريد الإلكتر��ني</li>
                <li>رسائل SMS</li>
                <li>تحليل ذكي</li>
              </ul>
            </div>

            <div className="animate-fadeInUp animation-delay-600">
              <h4 className="font-semibold mb-4">تواصل معنا</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@feedback-platform.com</li>
                <li>+966 50 123 4567</li>
                <li>الرياض، السعودية</li>
                <li>الأحد - الخميس 9ص - 6م</li>
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
