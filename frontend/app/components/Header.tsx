import React from "react";
import Link from "next/link";
import { Gauge, List, PlusCircle, User, Bot } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard">
            <div className="text-xl font-bold text-indigo-600 tracking-wide">
              SmartSaver
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex space-x-4">
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
            <Link
              href="/user-profile"
              className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <User className="w-5 h-5 mr-2" /> Profile
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
