import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  
  const onLogout = () => {
    logout();
  };
  
  const authLinks = (
    <>
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
      <li>
        <Link to="/transactions/add">Add Transaction</Link>
      </li>
      <li>
        <Link to="/transactions/history">History</Link>
      </li>
      <li>
        <Link to="/tax-summary">Tax Summary</Link>
      </li>
      <li>
        <a href="#!" onClick={onLogout}>
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </>
  );
  
  const guestLinks = (
    <>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
    </>
  );
  
  return (
    <nav className="navbar">
      <h1>
        <Link to="/">
          <i className="fas fa-money-bill-wave"></i> Taxxer
        </Link>
      </h1>
      {user && (
        <span className="welcome">
          {user.businessName}
        </span>
      )}
      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </nav>
  );
};

export default Navbar;