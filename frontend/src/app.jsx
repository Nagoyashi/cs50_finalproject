import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";

// Pages
import Dashboard from "./pages/Dashboard";
import Investments from "./pages/Investments";
import CashFlow from "./pages/CashFlow";
import FireCalculator from "./pages/FireCalculator";

export default function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />

        <main className="flex-1 ml-0 md:ml-64 p-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/cashflow" element={<CashFlow />} />
            <Route path="/fire" element={<FireCalculator />} />
            <Route path="*" element={<Dashboard />} /> {/* fallback */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}