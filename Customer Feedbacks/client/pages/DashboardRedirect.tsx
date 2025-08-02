import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new overview page
    navigate("/dashboard/overview", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 font-arabic flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري التوجيه...</p>
      </div>
    </div>
  );
}
