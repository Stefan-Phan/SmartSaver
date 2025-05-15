// components/dashboard/TransactionItem.tsx
import React from "react";
import { Transaction } from "@/types/Transaction";

interface TransactionItemProps {
  transaction: Transaction;
  categoryName: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  categoryName,
}) => {
  const isExpense = categoryName.toLocaleLowerCase() !== "income";
  const amountColor = isExpense ? "text-red-500" : "text-green-500";
  const amountPrefix = isExpense ? "-" : "+";

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
      <h6 className="font-semibold text-gray-700">{transaction.Name}</h6>
      <p
        className={`font-medium ${
          transaction.Type.toLocaleLowerCase() === "income"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {amountPrefix}${transaction.Amount}
      </p>
    </div>
  );
};

export default TransactionItem;
