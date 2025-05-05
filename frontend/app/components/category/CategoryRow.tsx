// components/category/CategoryRow.js
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Category } from "@/types/Category";

interface CategoryRowProps {
  category: Category;
  usage: { count: number; total: number };
  onDelete: (id: number) => void;
  onEdit: (category: Category) => void;
}

const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  usage,
  onDelete,
  onEdit, // Destructure the onEdit prop
}) => {
  return (
    <tr key={category.ID}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{category.Name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">${category.WeeklyLimit}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          ${usage.total.toFixed(2)} ({usage.count} transactions)
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEdit(category)} // Call the onEdit function
          className="text-indigo-600 hover:text-indigo-900 mr-2"
        >
          <PencilIcon className="h-5 w-5 inline-block" />
          <span className="sr-only">Edit</span>
        </button>
        <button
          onClick={() => onDelete(category.ID)}
          className="text-red-600 hover:text-red-900"
        >
          <TrashIcon className="h-5 w-5 inline-block" />
          <span className="sr-only">Delete</span>
        </button>
      </td>
    </tr>
  );
};

export default CategoryRow;
