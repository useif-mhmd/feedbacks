import { useNavigate } from "react-router-dom";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Custom hook for API calls with authentication
export function useApi() {
  const navigate = useNavigate();

  const handleAuthError = (response: Response) => {
    if (response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userInfo");
      navigate("/login");
      return true;
    }
    return false;
  };

  const apiCall = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
      });

      if (handleAuthError(response)) {
        throw new Error("Authentication failed");
      }

      return response;
    } catch (error) {
      // Add more specific error handling
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error(`Network error for ${url}:`, error);
        throw new Error(`Network connection failed. Please check your internet connection.`);
      }
      throw error;
    }
  };

  const get = (url: string) => apiCall(url);
  
  const post = (url: string, data?: any) =>
    apiCall(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });

  const put = (url: string, data?: any) =>
    apiCall(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });

  const del = (url: string) =>
    apiCall(url, {
      method: "DELETE",
    });

  return { get, post, put, delete: del };
}
