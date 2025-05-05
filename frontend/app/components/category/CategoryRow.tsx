import { Category } from "@/types/Category";

interface CategoryRowProps {
  category: Category;
  usage: {
    count: number;
    total: number;
  };
  onDelete: (id: number) => void;
}

export default function CategoryRow({
  category,
  usage,
  onDelete,
}: CategoryRowProps) {
  return (
    <tr key={category.ID} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap font-medium">
        {category.Name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">${category.WeeklyLimit}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        ${usage?.total?.toFixed(2) || "0.00"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onDelete(category.ID)}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={usage?.count > 0}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
