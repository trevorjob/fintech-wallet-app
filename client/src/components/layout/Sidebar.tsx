// src/components/layout/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  PlusCircle,
  Send,
  CreditCard,
  History,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: PlusCircle, label: "Fund Wallet", path: "/fund" },
    { icon: Send, label: "Transfer", path: "/transfer" },
    { icon: CreditCard, label: "Withdraw", path: "/withdraw" },
    { icon: History, label: "Transactions", path: "/transactions" },
    // { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-white">
      <div className="flex flex-col flex-1 p-4">
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 mr-3 ${
                    isActive ? "text-blue-700" : "text-gray-500"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
