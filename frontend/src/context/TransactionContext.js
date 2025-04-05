import React, { createContext, useReducer } from 'react';
import axios from 'axios';
import transactionReducer from '../reducers/transactionReducer';

// Initial state
const initialState = {
  transactions: [],
  transaction: null,
  taxSummary: null,
  loading: true,
  error: null
};

// Create context
export const TransactionContext = createContext(initialState);

// Provider component
export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Get transactions
  const getTransactions = async () => {
    try {
      const res = await axios.get('/api/transactions');

      dispatch({
        type: 'GET_TRANSACTIONS',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Add transaction
  const addTransaction = async transaction => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/transactions', transaction, config);

      dispatch({
        type: 'ADD_TRANSACTION',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Update transaction
  const updateTransaction = async transaction => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(`/api/transactions/${transaction._id}`, transaction, config);

      dispatch({
        type: 'UPDATE_TRANSACTION',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Delete transaction
  const deleteTransaction = async id => {
    try {
      await axios.delete(`/api/transactions/${id}`);

      dispatch({
        type: 'DELETE_TRANSACTION',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Get tax summary
  const getTaxSummary = async (year = new Date().getFullYear()) => {
    try {
      const res = await axios.get(`/api/transactions/tax-summary?year=${year}`);

      dispatch({
        type: 'GET_TAX_SUMMARY',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response.data.message
      });
    }
  };

  // Clear transactions
  const clearTransactions = () => {
    dispatch({ type: 'CLEAR_TRANSACTIONS' });
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions: state.transactions,
        transaction: state.transaction,
        taxSummary: state.taxSummary,
        loading: state.loading,
        error: state.error,
        getTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTaxSummary,
        clearTransactions
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};