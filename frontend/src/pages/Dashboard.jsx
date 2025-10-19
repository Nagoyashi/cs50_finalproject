import { useEffect, useState } from "react";

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState([]);
  const [cash, setCash] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/portfolio")
      .then(res => res.json())
      .then(data => {
        setPortfolio(data.portfolio);
        setCash(data.cash);
        setTotal(data.total);
      });
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Cash: ${cash}</p>
      <p>Total Net Worth: ${total}</p>
      <table className="table-auto border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Shares</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map(stock => (
            <tr key={stock.symbol}>
              <td>{stock.symbol}</td>
              <td>{stock.shares}</td>
              <td>${stock.price}</td>
              <td>${stock.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}