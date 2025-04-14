import { useState, useEffect } from "react";
import { api } from '../utils/api';

export default function TaxSummary() {
  const [summaryData, setSummaryData] = useState({
    monthly: {},
    yearly: {},
    loading: true,
    error: null
  });
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [transactions, setTransactions] = useState({ incomes: [], spendings: [] });
  const [showModal, setShowModal] = useState(false);
  // Add new state for storing all transactions
  const [allTransactions, setAllTransactions] = useState({
    incomes: [],
    spendings: []
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

      // Store all transactions
      setAllTransactions({ incomes, spendings });

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

  const handleMonthClick = (monthKey) => {
    const [year, month] = monthKey.split('-');
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // Last day of month

    // Use allTransactions instead of undefined incomes and spendings
    const monthlyIncomes = allTransactions.incomes.filter(income => {
      const date = new Date(income.date);
      return date >= startDate && date <= endDate;
    });

    const monthlySpendings = allTransactions.spendings.filter(spending => {
      const date = new Date(spending.date);
      return date >= startDate && date <= endDate;
    });

    setTransactions({
      incomes: monthlyIncomes,
      spendings: monthlySpendings
    });
    setSelectedMonth(monthKey);
    setShowModal(true);
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

  // Add Modal component
  const TransactionModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">
              {formatMonth(selectedMonth)} Transactions
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Income Section */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Income</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.incomes.map(income => (
                    <tr key={income._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{new Date(income.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{formatCurrency(income.amount)}</td>
                      <td className="px-4 py-2 capitalize">{income.category}</td>
                      <td className="px-4 py-2">{income.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Spending Section */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Spending</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.spendings.map(spending => (
                    <tr key={spending._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{new Date(spending.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{formatCurrency(spending.amount)}</td>
                      <td className="px-4 py-2 capitalize">{spending.category}</td>
                      <td className="px-4 py-2 capitalize">{spending.paymentMethod}</td>
                      <td className="px-4 py-2">{spending.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Update the monthly summary cards to be clickable
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
              <div
                key={monthKey}
                onClick={() => handleMonthClick(monthKey)}
                className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
              >
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

      {/* Render the modal */}
      <TransactionModal />
    </div>
  );
}