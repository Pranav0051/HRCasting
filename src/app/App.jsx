import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ProductDetails from "./pages/ProductDetails";

export default function App() {
  const [adminToken, setAdminToken] = useState(null);
  const [adminUsername, setAdminUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hr_casting_admin_token");
    const username = localStorage.getItem("hr_casting_admin_user");
    if (token && username) {
      setAdminToken(token);
      setAdminUsername(username);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, username) => {
    localStorage.setItem("hr_casting_admin_token", token);
    localStorage.setItem("hr_casting_admin_user", username);
    setAdminToken(token);
    setAdminUsername(username);
    navigate("/admin/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("hr_casting_admin_token");
    localStorage.removeItem("hr_casting_admin_user");
    setAdminToken(null);
    setAdminUsername("");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F10] text-white flex items-center justify-center font-semibold text-lg">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage adminToken={adminToken} onLogout={handleLogout} />}
      />
      <Route
        path="/product/:id"
        element={<ProductDetails adminToken={adminToken} onLogout={handleLogout} />}
      />
      <Route
        path="/admin"
        element={
          adminToken ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <AdminLogin onLogin={handleLogin} onBack={() => navigate("/")} />
          )
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          adminToken ? (
            <AdminDashboard
              token={adminToken}
              username={adminUsername}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/admin" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
