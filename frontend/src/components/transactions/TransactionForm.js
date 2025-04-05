import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TransactionContext } from '../../context/TransactionContext';

const TransactionForm = () => {
  const navigate = useNavigate();
  const { addTransaction } = useContext(TransactionContext);
  
  const [transaction, setTransaction] = useState({
    type: 'income',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().substr(0, 10),
    taxDeductible: true
  });
  
  const { type, amount, category, description, date, taxDeductible } = transaction;
  
  const onChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setTransaction({ ...transaction, [e.target.name]: value });
  };
  
  const onSubmit = e => {
    e.preventDefault();
    
    // Convert amount to number
    const newTransaction = {
      ...transaction,
      amount: parseFloat(amount)
    };
    
    addTransaction(newTransaction);
    navigate('/dashboard');
  };
  
  // Category options based on transaction type
  const categoryOptions = type === 'income' 
    ? ['Sales', 'Services', 'Interest', 'Dividends', 'Other Income']
    : ['Supplies', 'Equipment', 'Rent', 'Utilities', 'Marketing', 'Insurance', 'Professional Services', 'Travel', 'Meals', 'Other Expense'];
  
  return (
    <div className="form-container">
      <h1>{type === 'income' ? 'Add Income' : 'Add Expense'}</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="type">Transaction Type</label>
          <select
            name="type"
            value={type}
            onChange={onChange}
            required
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            name="amount"
            value={amount}
            onChange={onChange}
            min="0.01"
            step="0.01"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            value={category}
            onChange={onChange}
            required
          >
            <option value="">Select Category</option>
            {categoryOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            value={description}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            name="date"
            value={date}
            onChange={onChange}
            required
          />
        </div>
        
        {type === 'expense' && (
          <div className="form-group checkbox">
            <input
              type="checkbox"
              name="taxDeductible"
              checked={taxDeductible}
              onChange={onChange}
              id="taxDeductible"
            />
            <label htmlFor="taxDeductible">Tax Deductible</label>
          </div>
        )}
        
        <div className="form-group">
          <button type="submit" className="btn btn-primary">Add Transaction</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;