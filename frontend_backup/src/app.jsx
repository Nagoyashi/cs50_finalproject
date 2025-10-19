import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";

// Pages
import Login from "../../frontend/src/pages/Login";
import Register from "../../frontend/src/pages/Register";
import Dashboard from "../../frontend/src/pages/Dashboard";
import Investments from "../../frontend/src/pages/Investments";
import CashFlow from "../../frontend/src/pages/CashFlow";
import FireCalculator from "../../frontend/src/pages/FireCalculator";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Optional: check session on mount
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/portfolio", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) setIsLoggedIn(true);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    fetch("http://127.0.0.1:5000/api/logout", { credentials: "include" });
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="flex">
        {isLoggedIn && <Sidebar onLogout={handleLogout} />}

        <main className="flex-1 ml-0 md:ml-64 p-6">
          <Routes>
            {!isLoggedIn ? (
              <>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register onRegister={handleLogin} />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/investments" element={<Investments />} />
                <Route path="/cashflow" element={<CashFlow />} />
                <Route path="/fire" element={<FireCalculator />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}