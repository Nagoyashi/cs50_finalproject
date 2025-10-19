// src/pages/Investments.jsx
import { useState, useEffect } from "react";

export default function Investments() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/portfolio", {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load investments");

        setPortfolio(data.portfolio);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  if (loading) return <p>Loading investments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Investments</h1>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Symbol</th>
            <th className="p-2 border">Shares</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4">No investments yet</td>
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
  );
}