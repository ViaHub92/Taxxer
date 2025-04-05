import React from 'react';
import { Link } from 'react-router-dom';

const RecentTransactions = ({ transactions }) => {
  // Format date for display
  const formatDate = date => {
    return new Date(date).toLocaleDateString();
  };
  
  return (
    <div className="recent-transactions">
      <div className="header-row">
        <h2>Recent Transactions</h2>
        <Link to="/transactions/history" className="view-all">
          View All
        </Link>
      </div>
      
      {transactions.length === 0 ? (
        <p className="no-transactions">No recent transactions.</p>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction._id} className={`transaction-item ${transaction.type}`}>
                <td>{formatDate(transaction.date)}</td>
                <td>{transaction.type === 'income' ? 'Income' : 'Expense'}</td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td className={`amount ${transaction.type}`}>
                  ${transaction.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecentTransactions;