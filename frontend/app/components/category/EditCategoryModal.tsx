// components/category/EditCategoryModal.js
"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types/Category";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (categoryData: Category) => void;
  category: Category;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  category,
}) => {
  const [name, setName] = useState("");
  const [weeklyLimit, setWeeklyLimit] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.Name);
      setWeeklyLimit(category.WeeklyLimit.toString());
    }
  }, [category, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !weeklyLimit.trim()) {
      setError("Category name is required");
      return;
    }
    if (parseFloat(weeklyLimit) < 0) {
      setError("Weekly limit cannot be negative");
      return;
    }
    onUpdate({
      ID: category.ID,
      Name: name,
      WeeklyLimit: parseFloat(weeklyLimit),
    });
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-100/75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-indigo-600">
            Edit Category
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category Name:
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="weeklyLimit"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Weekly Limit:
            </label>
            <input
              type="number"
              id="weeklyLimit"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={weeklyLimit}
              onChange={(e) => setWeeklyLimit(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;
