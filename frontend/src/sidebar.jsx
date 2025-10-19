// src/sidebar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ChartPieIcon,
  WalletIcon,
  FireIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
  { name: "Investments", path: "/investments", icon: ChartPieIcon },
  { name: "Cash Flow", path: "/cashflow", icon: WalletIcon },
  { name: "FIRE Calculator", path: "/fire", icon: FireIcon }
];

export default function Sidebar({ onLogout }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center p-4 bg-gray-800 text-white">
        <button onClick={() => setOpen(!open)}>
          {open ? <XMarkIcon className="h-6 w-6"/> : <Bars3Icon className="h-6 w-6"/>}
        </button>
        <span className="ml-2 font-bold text-lg">Wealth Tracker</span>
      </div>

      {/* Sidebar */}
      <div className={`bg-gray-800 text-white h-screen fixed top-0 left-0 z-50 transform ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out w-64`}>
        <div className="p-6 font-bold text-xl border-b border-gray-700">
          Wealth Tracker
        </div>
        <nav className="mt-4">
          {links.map(link => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-6 py-3 my-1 rounded-lg hover:bg-gray-700 transition-colors ${isActive ? "bg-gray-700 font-semibold" : ""}`}
              >
                <Icon className="h-5 w-5 mr-3"/>
                {link.name}
              </Link>
            );
          })}
          {/* Logout button */}
          <button
            onClick={onLogout}
            className="flex items-center px-6 py-3 my-4 rounded-lg hover:bg-red-700 transition-colors w-full text-left"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3"/>
            Logout
          </button>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}