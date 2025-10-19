// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./sidebar";

// Pages
import Dashboard from "./pages/Dashboard";
import Investments from "./pages/Investments";
import CashFlow from "./pages/CashFlow";
import FireCalculator from "./pages/FireCalculator";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dynamically detect backend URL or use environment variable
const BASE_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/portfolio`, {
          credentials: "include",
        });
        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/api/logout`, { credentials: "include", method: "POST" });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggedIn(false);
    }
  };

  if (checkingAuth) return <p className="p-6">Checking authentication...</p>;

  return (
    <Router>
      <div className="flex">
        {isLoggedIn && <Sidebar onLogout={handleLogout} />}

        <main className={`flex-1 p-6 ${isLoggedIn ? "ml-0 md:ml-64" : ""}`}>
          <Routes>
            {!isLoggedIn ? (
              <>
                <Route path="/login" element={<Login onLogin={handleLogin} baseUrl={BASE_URL} />} />
                <Route path="/register" element={<Register onRegister={handleLogin} baseUrl={BASE_URL} />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            ) : (
              <>
                <Route path="/dashboard" element={<Dashboard baseUrl={BASE_URL} />} />
                <Route path="/investments" element={<Investments baseUrl={BASE_URL} />} />
                <Route path="/cashflow" element={<CashFlow baseUrl={BASE_URL} />} />
                <Route path="/fire" element={<FireCalculator baseUrl={BASE_URL} />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}