import React from 'react';

const TransactionSummary = ({ transactions, taxSummary }) => {
  // Calculate totals
  const calculateTotals = () => {
    let income = 0;
    let expenses = 0;
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        income += transaction.amount;
      } else {
        expenses += transaction.amount;
      }
    });
    
    return {
      income,
      expenses,
      profit: income - expenses
    };
  };
  
  const totals = calculateTotals();
  
  return (
    <div className="transaction-summary">
      <h2>Financial Summary</h2>
      
      <div className="summary-cards">
        <div className="summary-card income">
          <h3>Income</h3>
          <p className="amount">${totals.income.toFixed(2)}</p>
        </div>
        
        <div className="summary-card expenses">
          <h3>Expenses</h3>
          <p className="amount">${totals.expenses.toFixed(2)}</p>
        </div>
        
        <div className="summary-card profit">
          <h3>Profit</h3>
          <p className="amount">${totals.profit.toFixed(2)}</p>
        </div>
        
        {taxSummary && (
          <div className="summary-card tax">
            <h3>Estimated Tax</h3>
            <p className="amount">${taxSummary.estimatedTax.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionSummary;