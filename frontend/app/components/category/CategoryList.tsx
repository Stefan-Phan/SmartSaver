// components/category/CategoryList.js
import { Category } from "@/types/Category";
import CategoryRow from "./CategoryRow";

interface CategoryListProps {
  categories: Category[];
  categoryUsage: { [categoryId: number]: { count: number; total: number } };
  isLoading: boolean;
  error: string;
  onDelete: (id: number) => void;
  onEdit: (category: Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  categoryUsage,
  isLoading,
  error,
  onDelete,
  onEdit,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading categories...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">No categories found</div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-white border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-purple-600 uppercase">
              Category
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-purple-600 uppercase">
              Weekly Limit
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-purple-600 uppercase">
              Total Amount
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-purple-600 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {categories.map((category) => (
            <CategoryRow
              key={category.ID}
              category={category}
              usage={categoryUsage[category.ID] || { count: 0, total: 0 }}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
