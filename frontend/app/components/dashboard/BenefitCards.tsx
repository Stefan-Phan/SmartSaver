import React from "react";
import { FaCreditCard, FaRobot } from "react-icons/fa";
import { MdSavings } from "react-icons/md";
import { IoSettings } from "react-icons/io5";

const BenefitCards: React.FC = () => {
  const options = [
    {
      title: "Easy Tracking",
      icon: <FaCreditCard className="w-13 h-13 text-green-500" />,
      description: "Monitor income and expenses efficiently.",
      color: "bg-green-100",
    },
    {
      title: "Smart Insights",
      icon: <FaRobot className="w-13 h-13 text-purple-500" />,
      description: "Get daily AI advice for better money decisions.",
      color: "bg-purple-100",
    },
    {
      title: "Auto Savings",
      icon: <MdSavings className="w-13 h-13 text-orange-500" />,
      description: "Automatically track and calculate your savings.",
      color: "bg-orange-100",
    },
    {
      title: "Custom Goals",
      icon: <IoSettings className="w-13 h-13 text-blue-500" />,
      description: "Tailor settings to your unique financial needs.",
      color: "bg-blue-100",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-3">
      {options.map((option, index) => (
        <div
          key={index}
          className={`flex flex-col py-12 px-5 justify-center rounded-lg shadow-md transition-transform transform hover:scale-105 ${option.color}`}
        >
          <div className="mb-2">{option.icon}</div>
          <p className="text-xl font-medium text-gray-700 mb-2">
            {option.title}
          </p>
          <p className="text-gray-500">{option.description}</p>
        </div>
      ))}
    </div>
  );
};

export default BenefitCards;
