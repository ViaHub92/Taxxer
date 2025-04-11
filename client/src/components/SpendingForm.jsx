import { useState } from "react";

export default function SpendingForm() {
  const [spending, setSpending] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'housing',
    description: '',
    taxDeductible: false,
    paymentMethod: 'cash'
  });

  const categories = [
    'housing',
    'transportation',
    'food',
    'utilities',
    'healthcare',
    'entertainment',
    'business',
    'other'
  ];

  const paymentMethods = [
    'cash',
    'credit',
    'debit',
    'transfer',
    'check',
    'other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5050/spending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(spending)
      });
      
      if (response.ok) {
        alert('Spending recorded successfully!');
        setSpending({
          date: new Date().toISOString().split('T')[0],
          amount: '',
          category: 'housing',
          description: '',
          taxDeductible: false,
          paymentMethod: 'cash'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to record spending');
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Record Spending</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date:</label>
            <input
              type="date"
              value={spending.date}
              onChange={(e) => setSpending({...spending, date: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount:</label>
            <input
              type="number"
              value={spending.amount}
              onChange={(e) => setSpending({...spending, amount: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category:</label>
            <select
              value={spending.category}
              onChange={(e) => setSpending({...spending, category: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method:</label>
            <select
              value={spending.paymentMethod}
              onChange={(e) => setSpending({...spending, paymentMethod: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {paymentMethods.map(method => (
                <option key={method} value={method}>
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description:</label>
          <textarea
            value={spending.description}
            onChange={(e) => setSpending({...spending, description: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={spending.taxDeductible}
              onChange={(e) => setSpending({...spending, taxDeductible: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Tax Deductible</span>
          </label>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Record Spending
        </button>
      </form>
    </div>
  );
}