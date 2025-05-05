// components/category/EditCategoryModal.js
"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
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

  useEffect(() => {
    if (category) {
      setName(category.Name);
      setWeeklyLimit(category.WeeklyLimit.toString());
    }
  }, [category, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !weeklyLimit.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    onUpdate({
      ID: category.ID,
      Name: name,
      WeeklyLimit: parseFloat(weeklyLimit),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-lg w-96">
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Edit Category
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Category Name:
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="weeklyLimit"
                className="block text-sm font-medium text-gray-700"
              >
                Weekly Limit:
              </label>
              <input
                type="number"
                id="weeklyLimit"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={weeklyLimit}
                onChange={(e) => setWeeklyLimit(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded shadow-sm mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;
