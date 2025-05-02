import { Transaction } from "@/types/Transaction";
import TransactionItem from "../dashboard/TransactionItem";
import { Category } from "@/types/Category";

interface SidebarProps {
  transactions: Transaction[];
  categories: Category[];
}

export default function Sidebar({ transactions, categories }: SidebarProps) {
  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.ID === categoryId);
    return category ? category.Name : "Unknown";
  };

  return (
    <div
      className="flex flex-col bg-gray-50 p-10 w-1/4 justify-center items-center text-center"
      style={{
        borderTopLeftRadius: "4rem",
        borderBottomLeftRadius: "4rem",
      }}
    >
      <h3 className=" text-xl font-semibold mb-4">Recent Transactions</h3>
      {transactions.length > 0 ? (
        <div className="w-full">
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.ID}
              transaction={transaction}
              categoryName={getCategoryName(transaction.CategoryID)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No recent transactions.</p>
      )}
    </div>
  );
}
