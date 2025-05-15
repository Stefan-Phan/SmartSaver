"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// import icons
import {
  Gauge,
  List,
  PlusCircle,
  User,
  Bot,
  LogIn,
  LogOut,
} from "lucide-react";

const Header: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, [token]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/");
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard">
            <div className="text-xl font-bold text-indigo-600 tracking-wide">
              SmartSaver
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex space-x-4 items-center">
            {token ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <Gauge className="w-5 h-5 mr-2" /> Dashboard
                </Link>
                <Link
                  href="/transaction"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <List className="w-5 h-5 mr-2" /> Transactions
                </Link>
                <Link
                  href="/category"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <PlusCircle className="w-5 h-5 mr-2" /> Categories
                </Link>
                <Link
                  href="/ask-ai"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <Bot className="w-5 h-5 mr-2" /> Ask AI
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/"
                className="flex items-center px-3 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign Up
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
