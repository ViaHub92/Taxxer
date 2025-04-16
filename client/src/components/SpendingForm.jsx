import { useState } from "react";

export default function SpendingForm() {
  const [spending, setSpending] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'housing',
    description: '',
    paymentMethod: 'cash'
  });

  const categories = [
    'supplies',
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
      const response = await fetch("https://api.taxxer.link/spending", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token")
        },
        body: JSON.stringify(spending)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to add spending");
      }

      setSpending({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: 'housing',
        description: '',
        paymentMethod: 'cash'
      });
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
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