import { Transaction } from "@/types/Transaction";
import { Edit, Trash2 } from "lucide-react";

interface TransactionItemProps {
  t: Transaction;
  handleDeleteTransaction: (ID: number) => void;
  openUpdateModal: (t: Transaction) => void;
}

export default function TransactionItem({
  t,
  handleDeleteTransaction,
  openUpdateModal,
}: TransactionItemProps) {
  // Format amount for display
  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <tr key={t.ID} className="hover:bg-purple-50 transition">
      <td className="px-6 py-4 text-sm text-gray-700">{t.Name}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            t.Type.toLocaleLowerCase() === "income"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {t.Type.toLocaleLowerCase() === "income" ? "Income" : "Expense"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {t.Type.toLocaleLowerCase() === "income" ? "Income" : t.CategoryName}
      </td>
      <td
        className={`px-6 py-4 whitespace-nowrap font-medium ${
          t.Type.toLocaleLowerCase() === "income"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {t.Type.toLocaleLowerCase() === "income" ? "+" : "-"}$
        {formatAmount(t.Amount)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-800">
        {formatDate(t.CreatedAt)}
      </td>
      <td className="px-6 py-4 text-sm font-semibold">
        <button
          onClick={() => handleDeleteTransaction(t.ID)}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none cursor-pointer"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
