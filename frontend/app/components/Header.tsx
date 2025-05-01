import React from "react";
import Link from "next/link";
import {
  FaListAlt,
  FaPlusCircle,
  FaUser,
  FaQuestionCircle,
  FaTachometerAlt,
} from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <div className="flex justify-center bg-gray-200 py-2 sticky top-0 z-10">
      <Link
        href="/dashboard"
        className="flex items-center px-3 py-2 mx-2 text-gray-700 rounded hover:bg-gray-300 transition-colors"
      >
        <FaTachometerAlt className="mr-2" /> Dashboard
      </Link>
      <Link
        href="/transaction"
        className="flex items-center px-3 py-2 mx-2 text-gray-700 rounded hover:bg-gray-300 transition-colors"
      >
        <FaListAlt className="mr-2" /> Transaction
      </Link>
      <Link
        href="/category"
        className="flex items-center px-3 py-2 mx-2 text-gray-700 rounded hover:bg-gray-300 transition-colors"
      >
        <FaPlusCircle className="mr-2" /> Category
      </Link>
      <Link
        href="/ask-ai"
        className="flex items-center px-3 py-2 mx-2 text-gray-700 rounded hover:bg-gray-300 transition-colors"
      >
        <FaQuestionCircle className="mr-2" /> AskAI
      </Link>
      <Link
        href="/user-profile"
        className="flex items-center px-3 py-2 mx-2 text-gray-700 rounded hover:bg-gray-300 transition-colors"
      >
        <FaUser className="mr-2" /> UserProfile
      </Link>
    </div>
  );
};

export default Header;
