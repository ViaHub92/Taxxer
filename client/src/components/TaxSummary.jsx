import { useState, useEffect } from "react";
import { api } from '../utils/api';
import { jsPDF } from "jspdf";
import { autoTable } from 'jspdf-autotable';

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
  // Add new state for yearly view
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearlyViewType, setYearlyViewType] = useState(null); // 'income' or 'spending'

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
      const monthKey = `${year}-${month}`;

      console.log('Debug - Processing Income:', {
        date: income.date,
        month,
        year,
        monthKey,
        amount: income.amount
      });
      
      // Initialize structures if they don't exist
      if (!yearly[year]) {
        yearly[year] = { income: 0, expenses: 0, taxOwed: 0 };
      }
      if (!monthly[monthKey]) {
        monthly[monthKey] = { income: 0, expenses: 0, taxOwed: 0 };
      }

      // Add income
      yearly[year].income += parseFloat(income.amount);
      monthly[monthKey].income += parseFloat(income.amount);
    });

    // Process expenses
    spendings.forEach(spending => {
      const date = new Date(spending.date);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthKey = `${year}-${month}`;

      console.log('Debug - Processing Spending:', {
        date: spending.date,
        month,
        year,
        monthKey,
        amount: spending.amount
      });

      // Initialize structures if they don't exist
      if (!yearly[year]) {
        yearly[year] = { income: 0, expenses: 0, taxOwed: 0 };
      }
      if (!monthly[monthKey]) {
        monthly[monthKey] = { income: 0, expenses: 0, taxOwed: 0 };
      }

      // Add expenses
      yearly[year].expenses += parseFloat(spending.amount);
      monthly[monthKey].expenses += parseFloat(spending.amount);
    });

    console.log('Debug - Monthly Totals:', Object.entries(monthly).map(([key, value]) => ({
      monthKey: key,
      income: value.income,
      expenses: value.expenses
    })));

    // Remove empty months (those with no transactions)
    Object.keys(monthly).forEach(monthKey => {
      if (monthly[monthKey].income === 0 && monthly[monthKey].expenses === 0) {
        delete monthly[monthKey];
      }
    });

    // Calculate tax owed
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
    return Math.max(0, taxableIncome * 0.9235 * 0.153); // this is self-employment tax rate in virginia
  };

  const handleMonthClick = (monthKey) => {
    const [year, month] = monthKey.split('-');
    // Create dates in UTC to avoid timezone issues
    const startDate = new Date(Date.UTC(parseInt(year), parseInt(month), 1));
    const endDate = new Date(Date.UTC(parseInt(year), parseInt(month) + 1, 0));
  
    // Use allTransactions instead of undefined incomes and spendings
    const monthlyIncomes = allTransactions.incomes.filter(income => {
      const date = new Date(income.date);
      return date >= startDate && date <= endDate && 
             date.getUTCFullYear() === parseInt(year); // Add year check
    })

    .sort((a, b) => new Date(a.date) - new Date(b.date));
    const monthlySpendings = allTransactions.spendings.filter(spending => {
      const date = new Date(spending.date);
      return date >= startDate && date <= endDate && 
             date.getUTCFullYear() === parseInt(year); // Add year check
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setTransactions({
      incomes: monthlyIncomes,
      spendings: monthlySpendings
    });
    setSelectedMonth(monthKey);
    setShowModal(true);
  };

  // Add new handler for yearly view
  const handleYearClick = (year, type) => {
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);

    const filteredTransactions = type === 'income' 
      ? allTransactions.incomes.filter(income => {
          const date = new Date(income.date);
          return date >= yearStart && date <= yearEnd;
        })
      : allTransactions.spendings.filter(spending => {
          const date = new Date(spending.date);
          return date >= yearStart && date <= yearEnd;
        });

    // Sort the filtered transactions by date
    const sortedTransactions = filteredTransactions.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    setTransactions({
      incomes: type === 'income' ? sortedTransactions : [],
      spendings: type === 'spending' ? sortedTransactions : []
    });
    setSelectedYear(year);
    setYearlyViewType(type);
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

    const title = selectedYear 
      ? `${selectedYear} ${yearlyViewType === 'income' ? 'Income' : 'Spending'}`
      : formatMonth(selectedMonth) + ' Transactions';

      const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const title = selectedYear 
          ? `${selectedYear} ${yearlyViewType === 'income' ? 'Income' : 'Spending'}`
          : formatMonth(selectedMonth) + ' Transactions';
      
        // Add title
        doc.setFontSize(16);
        doc.text(title, 14, 15);
        doc.setFontSize(12);
      
        let startY = 25;
        const margin = 20;
      
        if (yearlyViewType === 'income' || !selectedYear) {
          const incomeData = transactions.incomes.map(income => [
            new Date(income.date).toLocaleDateString(),
            formatCurrency(income.amount),
            income.category,
            income.description
          ]);
      
          if (incomeData.length > 0) {
            autoTable(doc, {
              startY,
              head: [['Date', 'Amount', 'Category', 'Description']],
              body: incomeData,
              headStyles: { fillColor: [63, 131, 248] },
              didDrawPage: (data) => {
                startY = data.cursor.y + margin;
              }
            });
    
            startY += margin;
            const totalIncome = transactions.incomes.reduce((sum, income) => 
              sum + parseFloat(income.amount), 0
            );
            doc.text(`Total Income: ${formatCurrency(totalIncome)}`, 14, startY);
            startY += margin * 1.5;
          }
        }
      
        if (yearlyViewType === 'spending' || !selectedYear) {
          const spendingData = transactions.spendings.map(spending => [
            new Date(spending.date).toLocaleDateString(),
            formatCurrency(spending.amount),
            spending.category,
            spending.paymentMethod,
            spending.description
          ]);
      
          if (spendingData.length > 0) {
            if (yearlyViewType !== 'spending') {
              doc.text('Spending', 14, startY - 5);
            }
      
            autoTable(doc, {
              startY,
              head: [['Date', 'Amount', 'Category', 'Payment Method', 'Description']],
              body: spendingData,
              headStyles: { fillColor: [63, 131, 248] },
              didDrawPage: (data) => {
                startY = data.cursor.y + margin;
              }
            });
      
            startY += margin;
            const totalSpending = transactions.spendings.reduce((sum, spending) => 
              sum + parseFloat(spending.amount), 0
            );
            doc.text(`Total Spending: ${formatCurrency(totalSpending)}`, 14, startY);
          }
        }
      
        // Save the PDF
        doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
      };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6 border-2 border-gray-200 shadow-xl">
          <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-gray-200">
            <h3 className="text-xl font-bold">{title}</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
              >
                Download PDF
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedYear(null);
                  setYearlyViewType(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Show only relevant section based on yearly view type */}
          {(!selectedYear || yearlyViewType === 'income') && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2 pb-2 border-b border-gray-200">Income</h4>
              <div className="overflow-x-auto border-2 border-gray-200 rounded-lg">
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
          )}

          {(!selectedYear || yearlyViewType === 'spending') && (
            <div>
              <h4 className="text-lg font-semibold mb-2 pb-2 border-b border-gray-200">Spending</h4>
              <div className="overflow-x-auto border-2 border-gray-200 rounded-lg">
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
          )}
        </div>
      </div>
    );
  };

  // Update the yearly summary card to include buttons
  return (
    <div className="space-y-8">
      {/* Yearly Summary */}
      <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-gray-200">Yearly Tax Summary</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(summaryData.yearly)
            .sort(([yearA], [yearB]) => yearA - yearB)
            .map(([year, data]) => (
              <div key={year} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold mb-2 pb-2 border-b border-gray-200">{year}</h3>
                <div className="space-y-2">
                  <p className="py-1 border-b border-gray-100">Income: {formatCurrency(data.income)}</p>
                  <p className="py-1 border-b border-gray-100">Expenses: {formatCurrency(data.expenses)}</p>
                  <p className="font-semibold text-blue-600 pt-1">
                    Tax Owed: {formatCurrency(data.taxOwed)}
                  </p>
                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={() => handleYearClick(year, 'income')}
                      className="flex-1 px-3 py-1 text-sm bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:outline-none"
                    >
                      View Income
                    </button>
                    <button
                      onClick={() => handleYearClick(year, 'spending')}
                      className="flex-1 px-3 py-1 text-sm bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:outline-none"
                    >
                      View Spending
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-gray-200">Monthly Tax Summary</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(summaryData.monthly)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // Changed from keyB.localeCompare(keyA)
            .map(([monthKey, data]) => (
              <div
                key={monthKey}
                onClick={() => handleMonthClick(monthKey)}
                className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 shadow-sm cursor-pointer hover:bg-gray-100 hover:border-blue-300 transition-all"
              >
                <h3 className="text-lg font-semibold mb-2 pb-2 border-b border-gray-200">{formatMonth(monthKey)}</h3>
                <div className="space-y-2">
                  <p className="py-1 border-b border-gray-100">Income: {formatCurrency(data.income)}</p>
                  <p className="py-1 border-b border-gray-100">Expenses: {formatCurrency(data.expenses)}</p>
                  <p className="font-semibold text-blue-600 pt-1">
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