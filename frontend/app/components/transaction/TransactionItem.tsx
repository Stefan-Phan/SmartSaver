import { Transaction } from "@/types/Transaction";
import { TrashIcon } from "@heroicons/react/24/outline";

interface TransactionItemProps {
  transaction: Transaction;
  categoryName: string;
}

export default function TransactionItem({
  transaction,
  categoryName,
}: TransactionItemProps) {
  return (
    <div className="flex px-6 py-5 items-center border border-gray-300 mb-6 rounded-lg transition-all duration-200 hover:scale-[1.01] hover:-translate-y-1 hover:shadow-lg hover:border-gray-400">
      <div className="flex items-center flex-1">
        <div className="w-full cursor-pointer hover:text-gray-700">
          {transaction.Name}
        </div>
        <div className="w-full cursor-pointer hover:text-gray-700">
          ${transaction.Amount}
        </div>
        <div className="w-full cursor-pointer hover:text-gray-700">
          {categoryName}
        </div>
      </div>

      <div className="flex space-x-4">
        <button className="text-red-600 hover:text-red-800 cursor-pointer">
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// import { useState, useRef, useEffect } from "react";

// // import type
// import { Item } from "@/types/Item";

// // import icon
// import { TrashIcon } from "@heroicons/react/24/outline";

// interface ShoppingItemProps {
//   item: Item;
//   onDelete: (id: string) => void;
//   onUpdate: (id: string, newText: string) => void;
// }

// export default function ShoppingItem({
//   item,
//   onDelete,
//   onUpdate,
// }: ShoppingItemProps) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editText, setEditText] = useState(item.text);

//   const handleEditSubmit = () => {
//     if (editText.trim()) {
//       onUpdate(item.id, editText);
//     }
//     setIsEditing(false);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       handleEditSubmit();
//     } else if (e.key === "Espace") {
//       setEditText(item.text);
//       setIsEditing(false);
//     }
//   };

//   return (
//     <div className="flex px-6 py-5 items-center border border-gray-300 mb-6 rounded-lg transition-all duration-200 hover:scale-[1.01] hover:-translate-y-1 hover:shadow-lg hover:border-gray-400">
//       <div className="flex items-center flex-1">
//         {isEditing ? (
//           <input
//             type="text"
//             value={editText}
//             onChange={(e) => setEditText(e.target.value)}
//             onKeyDown={handleKeyDown}
//             className="w-full rounded focus:outline-none"
//           />
//         ) : (
//           <div
//             className="w-full cursor-pointer hover:text-gray-700"
//             onClick={() => setIsEditing(true)}
//           >
//             {item.text}
//           </div>
//         )}
//       </div>

//       <div className="flex space-x-4">
//         <button
//           className="text-red-600 hover:text-red-800 cursor-pointer"
//           onClick={() => onDelete(item.id)}
//         >
//           <TrashIcon className="h-5 w-5" />
//         </button>
//       </div>
//     </div>
//   );
// }
