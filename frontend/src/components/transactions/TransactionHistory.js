import React, { useContext, useEffect, useState } from 'react';
import { TransactionContext } from '../../context/TransactionContext';
import TransactionItem from './TransactionItem';

const TransactionHistory = () => {
  const { transactions, getTransactions, loading } = useContext(TransactionContext);
  const [filter, setFilter] = useState({
    type: 'all',
    startDate: '',
    endDate: '',
    category: ''
  });
  
  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line
  }, []);
  
  const { type, startDate, endDate, category } = filter;
  
  const onChange = e => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };
  
  // Get unique categories from transactions
  const getUniqueCategories = () => {
    if (!transactions || transactions.length === 0) return [];
    const categories = transactions.map(transaction => transaction.category);
    return ['', ...new Set(categories)]; // Include empty option
  };
  
  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type
    if (type !== 'all' && transaction.type !== type) return false;
    
    // Filter by date range
    if (startDate && new Date(transaction.date) < new Date(startDate)) return false;
    if (endDate && new Date(transaction.date) > new Date(endDate)) return false;
    
    // Filter by category
    if (category && transaction.category !== category) return false;
    
    return true;
  });
  
  if (loading) {
    return <div className="loading">Loading transactions...</div>;
  }
  
  return (
    <div className="transaction-history">
      <h1>Transaction History</h1>
      
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="type">Type</label>
          <select name="type" value={type} onChange={onChange}>
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="startDate">From</label>
          <input 
            type="date" 
            name="startDate" 
            value={startDate} 
            onChange={onChange} 
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="endDate">To</label>
          <input 
            type="date" 
            name="endDate" 
            value={endDate} 
            onChange={onChange} 
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select name="category" value={category} onChange={onChange}>
            <option value="">All Categories</option>
            {getUniqueCategories().map(cat => (
              cat && <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredTransactions.length === 0 ? (
        <p className="no-transactions">No transactions found.</p>
      ) : (
        <div className="transaction-list">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Tax Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <TransactionItem key={transaction._id} transaction={transaction} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;