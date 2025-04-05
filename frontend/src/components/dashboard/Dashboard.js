import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { TransactionContext } from '../../context/TransactionContext';
import TransactionSummary from '../transactions/TransactionSummary';
import RecentTransactions from '../transactions/RecentTransactions';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { transactions, getTransactions, loading, getTaxSummary, taxSummary } = useContext(TransactionContext);

  useEffect(() => {
    getTransactions();
    getTaxSummary();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="dashboard">
      {user && (
        <div className="welcome-section">
          <h1>Welcome, {user.businessName}</h1>
          <p>Business Type: {user.businessType}</p>
        </div>
      )}
      
      <div className="dashboard-actions">
        <Link to="/transactions/add" className="btn btn-primary">
          Add Transaction
        </Link>
        <Link to="/tax-summary" className="btn btn-secondary">
          View Tax Summary
        </Link>
      </div>
      
      {!loading && transactions && (
        <>
          <TransactionSummary transactions={transactions} taxSummary={taxSummary} />
          <RecentTransactions transactions={transactions.slice(0, 5)} />
        </>
      )}
    </div>
  );
};

export default Dashboard;