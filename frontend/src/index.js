import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ Update this import
import './index.css';
import App from './App';

// ✅ Use the new createRoot API
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);