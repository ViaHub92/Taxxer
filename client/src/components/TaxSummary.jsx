import { useState, useEffect } from "react";
import { api } from '../utils/api';

export default function TaxSummary() {
  const [summaryData, setSummaryData] = useState({
    monthly: {},
    yearly: {},
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchTaxData();
  }, []);

  const fetchTaxData = async () => {
    try {
      const [incomes, spendings] = await Promise.all([
        api('/income'),
        api('/spending')
      ]);

      const processedData = processTaxData(incomes, spendings);
      setSummaryData({
        ...processedData,
        loading: false,
        error: null
      });
    } catch (err) {
      setSummaryData(prev => ({
        ...prev,
        loading: false,
        error: err.message
      }));
    }
  };

  const processTaxData = (incomes, spendings) => {
    const monthly = {};
    const yearly = {};

    // Process incomes
    incomes.forEach(income => {
      const date = new Date(income.date);
      const month = date.getMonth();
      const year = date.getFullYear();
      
      // Initialize structures if they don't exist
      if (!yearly[year]) {
        yearly[year] = { income: 0, expenses: 0, taxOwed: 0 };
      }
      if (!monthly[`${year}-${month}`]) {
        monthly[`${year}-${month}`] = { income: 0, expenses: 0, taxOwed: 0 };
      }

      // Add income
      yearly[year].income += parseFloat(income.amount);
      monthly[`${year}-${month}`].income += parseFloat(income.amount);
    });

    // Process expenses
    spendings.forEach(spending => {
      const date = new Date(spending.date);
      const month = date.getMonth();
      const year = date.getFullYear();

      // Initialize structures if they don't exist
      if (!yearly[year]) {
        yearly[year] = { income: 0, expenses: 0, taxOwed: 0 };
      }
      if (!monthly[`${year}-${month}`]) {
        monthly[`${year}-${month}`] = { income: 0, expenses: 0, taxOwed: 0 };
      }

      // Add expenses
      yearly[year].expenses += parseFloat(spending.amount);
      monthly[`${year}-${month}`].expenses += parseFloat(spending.amount);
    });

    // Calculate tax owed (simplified calculation - adjust based on your tax rules)
    Object.keys(yearly).forEach(year => {
      yearly[year].taxOwed = calculateTax(yearly[year].income, yearly[year].expenses);
    });

    Object.keys(monthly).forEach(monthKey => {
      monthly[monthKey].taxOwed = calculateTax(monthly[monthKey].income, monthly[monthKey].expenses);
    });

    return { monthly, yearly };
  };

  const calculateTax = (income, expenses) => {
    const taxableIncome = income - expenses;
    // This is a simplified tax calculation - I will change it to a more realistic one later
    return Math.max(0, taxableIncome * 0.3); // Assuming 30% tax rate
  };

  if (summaryData.loading) return <div className="text-center p-4">Loading...</div>;
  if (summaryData.error) return <div className="text-red-500 p-4">Error: {summaryData.error}</div>;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatMonth = (monthKey) => {
    const [year, month] = monthKey.split('-');
    return new Date(year, month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="space-y-8">
      {/* Yearly Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Yearly Tax Summary</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(summaryData.yearly)
            .sort(([yearA], [yearB]) => yearB - yearA)
            .map(([year, data]) => (
              <div key={year} className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">{year}</h3>
                <div className="space-y-2">
                  <p>Income: {formatCurrency(data.income)}</p>
                  <p>Expenses: {formatCurrency(data.expenses)}</p>
                  <p className="font-semibold text-blue-600">
                    Tax Owed: {formatCurrency(data.taxOwed)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Monthly Tax Summary</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(summaryData.monthly)
            .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
            .map(([monthKey, data]) => (
              <div key={monthKey} className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">{formatMonth(monthKey)}</h3>
                <div className="space-y-2">
                  <p>Income: {formatCurrency(data.income)}</p>
                  <p>Expenses: {formatCurrency(data.expenses)}</p>
                  <p className="font-semibold text-blue-600">
                    Tax Owed: {formatCurrency(data.taxOwed)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}