// src/pages/CashFlow.jsx
import { useState, useEffect } from "react";

export default function CashFlow() {
  const [cashflow, setCashflow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCashFlow = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/cashflow", {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load cash flow");

        setCashflow(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCashFlow();
  }, []);

  if (loading) return <p>Loading cash flow...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cash Flow</h1>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Type</th>
          </tr>
        </thead>
        <tbody>
          {cashflow.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center p-4">No cash flow data</td>
            </tr>
          ) : (
            cashflow.map((item, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{item.date || item.transacted}</td>
                <td className="p-2 border">${item.amount.toFixed(2)}</td>
                <td className="p-2 border">{item.type || "N/A"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}