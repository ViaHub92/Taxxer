import React, { useContext, useState } from 'react';
import { TransactionContext } from '../../context/TransactionContext';

const TransactionItem = ({ transaction }) => {
  const { deleteTransaction, updateTransaction } = useContext(TransactionContext);
  const [editing, setEditing] = useState(false);
  const [updatedTransaction, setUpdatedTransaction] = useState(transaction);
  
  // Format date for display
  const formatDate = date => {
    return new Date(date).toLocaleDateString();
  };
  
  // Handle edit mode toggle
  const toggleEdit = () => {
    setEditing(!editing);
    // Reset to original values if canceling edit
    if (editing) {
      setUpdatedTransaction(transaction);
    }
  };
  
  // Handle input changes
  const onChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setUpdatedTransaction({ ...updatedTransaction, [e.target.name]: value });
  };
  
  // Handle form submission
  const onSubmit = e => {
    e.preventDefault();
    
    // Convert amount to number if it's a string
    const finalTransaction = {
      ...updatedTransaction,
      amount: typeof updatedTransaction.amount === 'string' 
        ? parseFloat(updatedTransaction.amount) 
        : updatedTransaction.amount
    };
    
    updateTransaction(finalTransaction);
    setEditing(false);
  };
  
  // Category options based on transaction type
  const categoryOptions = updatedTransaction.type === 'income' 
    ? ['Sales', 'Services', 'Interest', 'Dividends', 'Other Income']
    : ['Supplies', 'Equipment', 'Rent', 'Utilities', 'Marketing', 'Insurance', 'Professional Services', 'Travel', 'Meals', 'Other Expense'];
  
  return (
    <tr className={`transaction-item ${transaction.type}`}>
      {editing ? (
        <>
          <td>
            <input 
              type="date" 
              name="date" 
              value={updatedTransaction.date.substring(0, 10)} 
              onChange={onChange} 
            />
          </td>
          <td>
            <select name="type" value={updatedTransaction.type} onChange={onChange}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </td>
          <td>
            <select name="category" value={updatedTransaction.category} onChange={onChange}>
              {categoryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </td>
          <td>
            <input 
              type="text" 
              name="description" 
              value={updatedTransaction.description} 
              onChange={onChange} 
            />
          </td>
          <td>
            <input 
              type="number" 
              name="amount" 
              value={updatedTransaction.amount} 
              onChange={onChange} 
              min="0.01" 
              step="0.01" 
            />
          </td>
          <td>
            {updatedTransaction.type === 'expense' ? (
              <input 
                type="checkbox" 
                name="taxDeductible" 
                checked={updatedTransaction.taxDeductible} 
                onChange={onChange} 
              />
            ) : (
              'N/A'
            )}
          </td>
          <td className="action-cell">
            <button className="btn-save" onClick={onSubmit}>Save</button>
            <button className="btn-cancel" onClick={toggleEdit}>Cancel</button>
          </td>
        </>
      ) : (
        <>
          <td>{formatDate(transaction.date)}</td>
          <td className={transaction.type}>
            {transaction.type === 'income' ? 'Income' : 'Expense'}
          </td>
          <td>{transaction.category}</td>
          <td>{transaction.description}</td>
          <td className={`amount ${transaction.type}`}>
            ${transaction.amount.toFixed(2)}
          </td>
          <td>
            {transaction.type === 'expense' 
              ? (transaction.taxDeductible ? 'Deductible' : 'Non-deductible') 
              : 'N/A'}
          </td>
          <td className="action-cell">
            <button className="btn-edit" onClick={toggleEdit}>Edit</button>
            <button className="btn-delete" onClick={() => deleteTransaction(transaction._id)}>
              Delete
            </button>
          </td>
        </>
      )}
    </tr>
  );
};

export default TransactionItem;