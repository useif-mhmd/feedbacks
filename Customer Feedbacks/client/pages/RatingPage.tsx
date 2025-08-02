import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Star,
  Heart,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface RatingPageData {
  customerName?: string;
  companyName: string;
  token: string;
}

interface SubmitResponse {
  success: boolean;
  rating: number;
  message: string;
  googleMapsLink?: string;
  showGoogleMaps?: boolean;
}

export default function RatingPage() {
  const { token } = useParams<{ token: string }>();
  const [pageData, setPageData] = useState<RatingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitResponse, setSubmitResponse] = useState<SubmitResponse | null>(null);

  useEffect(() => {
    if (token) {
      loadPageData();
    }
  }, [token]);

  const loadPageData = async () => {
    try {
      const response = await fetch(`/api/rating/token/${token}`);
      const result = await response.json();
      
      if (result.success) {
        setPageData(result.data);
      } else {
        setError(result.message || "رابط التقييم غير صالح");
      }
    } catch (err) {
      setError("حدث خطأ في تحميل الصفحة");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("يرجى اختيار تقييم");
      return;
    }

    if (rating <= 3 && !reason.trim()) {
      setError("يرجى كتابة سبب عدم الرضا");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/rating/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          rating,
          reason: reason.trim() || undefined,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitResponse(result);
        setSubmitted(true);
      } else {
        setError(result.message || "حدث خطأ في إرسال التقييم");
      }
    } catch (err) {
      setError("حدث خطأ في إرسال التقييم");
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingText = (stars: number) => {
    switch (stars) {
      case 1: return "غير راضي تماماً";
      case 2: return "غير راضي";
      case 3: return "محايد";
      case 4: return "راضي";
      case 5: return "راضي جداً";
      default: return "";
    }
  };

  const getRatingEmoji = (stars: number) => {
    switch (stars) {
      case 1: return "😢";
      case 2: return "😕";
      case 3: return "😐";
      case 4: return "😊";
      case 5: return "😍";
      default: return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 font-arabic flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">جاري تحميل صفحة التقييم...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 font-arabic flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">عذراً!</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              قد يكون الرابط منتهي الصلاحية أو غير صحيح
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted && submitResponse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 font-arabic flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-lg mx-4">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              شكراً لتقييمك! {getRatingEmoji(submitResponse.rating)}
            </h1>
            <p className="text-gray-600 mb-6">{submitResponse.message}</p>
            
            {submitResponse.showGoogleMaps && submitResponse.googleMapsLink && (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">
                  🗺️ ساعدنا في مشاركة تجربتك
                </h3>
                <p className="text-blue-700 text-sm mb-4">
                  يسعدنا أن تقييمك كان إيجابياً! هل يمكنك مشاركة تجربتك على Google Maps؟
                </p>
                <Button 
                  asChild 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <a 
                    href={submitResponse.googleMapsLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    قيّمنا على Google Maps
                  </a>
                </Button>
              </div>
            )}
            
            <div className="text-center">
              <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                نقدر وقتك ومشاركة رأيك معنا
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 font-arabic" dir="rtl">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl mb-2">
              🌟 قيّم تجربتك معنا
            </CardTitle>
            <CardDescription className="text-blue-100">
              {pageData?.customerName ? (
                `مرحباً ${pageData.customerName}! نود معرفة رأيك في خدماتنا`
              ) : (
                "نود معرفة رأيك في خدماتنا"
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Rating Section */}
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                كيف تقيم تجربتك معنا؟
              </h3>
              
              <div className="flex justify-center gap-3 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="transform transition-transform hover:scale-110 focus:outline-none"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`h-12 w-12 ${
                        star <= (hoveredRating || rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              
              {(hoveredRating || rating) > 0 && (
                <div className="text-center">
                  <span className="text-2xl">{getRatingEmoji(hoveredRating || rating)}</span>
                  <p className="text-lg font-medium text-gray-700 mt-2">
                    {getRatingText(hoveredRating || rating)}
                  </p>
                </div>
              )}
            </div>

            {/* Reason Section for negative ratings */}
            {rating > 0 && rating <= 3 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <MessageCircle className="h-4 w-4 inline ml-1" />
                  من فضلك أخبرنا كيف يمكننا التحسين؟
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="ملاحظاتك تساعدنا في تطوير خدماتنا..."
                  className="w-full min-h-[100px] resize-none text-right"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1 text-left">
                  {reason.length}/500
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin ml-2" />
                    جاري الإرسال...
                  </>
                ) : (
                  "إرسال التقييم"
                )}
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                شكراً لوقتك الثمين في تقييم خدماتنا
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {pageData?.companyName}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
