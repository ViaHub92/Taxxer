import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import PrivateRoute from './components/routing/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TransactionForm from './components/transactions/TransactionForm';
import TransactionHistory from './components/transactions/TransactionHistory';
import TaxSummary from './components/tax/TaxSummary';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <Router>
          <div className="app">
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/transactions/add" 
                  element={
                    <PrivateRoute>
                      <TransactionForm />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/transactions/history" 
                  element={
                    <PrivateRoute>
                      <TransactionHistory />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/tax-summary" 
                  element={
                    <PrivateRoute>
                      <TaxSummary />
                    </PrivateRoute>
                  } 
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </div>
          </div>
        </Router>
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;