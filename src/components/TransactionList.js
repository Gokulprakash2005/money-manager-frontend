import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { format, isAfter, subHours } from 'date-fns';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  const canEdit = (datetime) => {
    const transactionTime = new Date(datetime);
    const twelveHoursAgo = subHours(new Date(), 12);
    return isAfter(transactionTime, twelveHoursAgo);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions found</p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type}
                  </span>
                  <span className="text-sm text-gray-500">{transaction.division}</span>
                </div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-600">
                  {transaction.category} • {format(new Date(transaction.datetime), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </p>
                <div className="flex gap-2 mt-1">
                  {canEdit(transaction.datetime) && (
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(transaction._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;