import { useState } from "react";

export default function IncomeForm() {
  const [income, setIncome] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'salary',
    description: '',
    taxable: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5050/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(income)
      });
      
      if (response.ok) {
        alert('Income added successfully!');
        setIncome({
          date: new Date().toISOString().split('T')[0],
          amount: '',
          category: 'card',
          description: '',
          taxable: true
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add income');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Add Income</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={income.date}
            onChange={(e) => setIncome({...income, date: e.target.value})}
            className="border p-1 ml-2"
          />
        </div>

        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={income.amount}
            onChange={(e) => setIncome({...income, amount: e.target.value})}
            className="border p-1 ml-2"
            step="0.01"
            required
          />
        </div>

        <div>
          <label>Category:</label>
          <select
            value={income.category}
            onChange={(e) => setIncome({...income, category: e.target.value})}
            className="border p-1 ml-2"
          >
            <option value="card">Card</option>
            <option value="cash">Cash</option>
            <option value="online">Online-Payment</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Income
        </button>
      </form>
    </div>
  );
}