import { useState } from "react";

export default function IncomeForm() {
  const [income, setIncome] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'salary',
    description: '',
    taxable: true
  });

  const categories = [
    'salary',
    'freelance',
    'investments',
    'rental',
    'business',
    'other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api('/income', {
        method: 'POST',
        body: JSON.stringify(income)
      });
      setIncome({
        date: '',
        amount: '',
        category: '',
        description: '',
        taxable: true
      });
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Record Income</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date:</label>
            <input
              type="date"
              value={income.date}
              onChange={(e) => setIncome({...income, date: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount:</label>
            <input
              type="number"
              value={income.amount}
              onChange={(e) => setIncome({...income, amount: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category:</label>
          <select
            value={income.category}
            onChange={(e) => setIncome({...income, category: e.target.value})}
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
          <label className="block text-sm font-medium text-gray-700">Description:</label>
          <textarea
            value={income.description}
            onChange={(e) => setIncome({...income, description: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Record Income
        </button>
      </form>
    </div>
  );
}