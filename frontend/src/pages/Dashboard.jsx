// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState([]);
  const [cash, setCash] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/portfolio", {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to load portfolio");

        setPortfolio(data.portfolio || []);
        setCash(data.cash || 0);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) return <p>Loading portfolio...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded shadow-sm">
          <p className="text-gray-600">Cash</p>
          <p className="text-xl font-semibold">${cash.toFixed(2)}</p>
        </div>
        <div className="p-4 border rounded shadow-sm">
          <p className="text-gray-600">Total Portfolio Value</p>
          <p className="text-xl font-semibold">${total.toFixed(2)}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Symbol</th>
              <th className="p-2 border">Shares</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No investments yet
                </td>
              </tr>
            ) : (
              portfolio.map((item) => (
                <tr key={item.symbol}>
                  <td className="p-2 border">{item.symbol}</td>
                  <td className="p-2 border">{item.shares}</td>
                  <td className="p-2 border">${item.price.toFixed(2)}</td>
                  <td className="p-2 border">${item.total.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}