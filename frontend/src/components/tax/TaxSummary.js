import React, { useContext, useEffect, useState } from 'react';
import { TransactionContext } from '../../context/TransactionContext';

const TaxSummary = () => {
  const { getTaxSummary, taxSummary, loading } = useContext(TransactionContext);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  useEffect(() => {
    getTaxSummary(selectedYear);
    // eslint-disable-next-line
  }, [selectedYear]);
  
  // Generate year options (3 years back and current year)
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];
  
  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };
  
  if (loading || !taxSummary) {
    return <div className="loading">Loading tax summary...</div>;
  }
  
  return (
    <div className="tax-summary">
      <h1>Tax Summary</h1>
      
      <div className="year-selector">
        <label htmlFor="year">Select Tax Year: </label>
        <select 
          name="year" 
          value={selectedYear}
          onChange={handleYearChange}
        >
          {yearOptions.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      
      <div className="summary-card">
        <div className="summary-section">
          <h2>Income & Expenses</h2>
          <div className="summary-item">
            <span>Total Income:</span>
            <span className="amount">${taxSummary.totalIncome.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Total Deductible Expenses:</span>
            <span className="amount">${taxSummary.totalExpenses.toFixed(2)}</span>
          </div>
          <div className="summary-item highlight">
            <span>Taxable Profit:</span>
            <span className="amount">${taxSummary.profit.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="summary-section">
          <h2>Tax Calculation</h2>
          <div className="summary-item">
            <span>Tax Rate:</span>
            <span className="amount">{(taxSummary.taxRate * 100).toFixed(0)}%</span>
          </div>
          <div className="summary-item highlight important">
            <span>Estimated Tax:</span>
            <span className="amount">${taxSummary.estimatedTax.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="summary-note">
          <p>
            <strong>Note:</strong> This is a simplified tax estimate. Actual tax obligations may vary based on your specific situation, deductions, and current tax laws. Consult a tax professional for accurate tax advice.
          </p>
        </div>
      </div>
      
      <div className="quarterly-estimates">
        <h2>Quarterly Tax Estimates</h2>
        <table className="tax-table">
          <thead>
            <tr>
              <th>Quarter</th>
              <th>Period</th>
              <th>Due Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Q1</td>
              <td>Jan 1 - Mar 31</td>
              <td>April 15, {selectedYear}</td>
              <td>${(taxSummary.estimatedTax / 4).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Q2</td>
              <td>Apr 1 - Jun 30</td>
              <td>June 15, {selectedYear}</td>
              <td>${(taxSummary.estimatedTax / 4).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Q3</td>
              <td>Jul 1 - Sep 30</td>
              <td>September 15, {selectedYear}</td>
              <td>${(taxSummary.estimatedTax / 4).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Q4</td>
              <td>Oct 1 - Dec 31</td>
              <td>January 15, {selectedYear + 1}</td>
              <td>${(taxSummary.estimatedTax / 4).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaxSummary;