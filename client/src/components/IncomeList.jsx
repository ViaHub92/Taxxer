import { useState, useEffect } from "react";
import { api, deleteIncome } from '../utils/api';

export default function IncomeList() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5050/income', {
        headers: {
          'x-auth-token': token
        }
      });
      if (!response.ok) throw new Error('Failed to fetch incomes');
      const data = await response.json();
      setIncomes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income?')) {
      return;
    }

    try {
      await deleteIncome(id);
      // Refresh the list after deletion
      fetchIncomes();
    } catch (err) {
      setError(err.message);
    }
  };

  // Sort incomes by date (newest first)
  const sortedIncomes = [...incomes].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  
  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Income History</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedIncomes.map((income) => (
              <tr key={income._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(income.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${parseFloat(income.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">
                  {income.category}
                </td>
                <td className="px-6 py-4">
                  {income.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(income._id)}
                    className="text-rose-500 hover:text-rose-700 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-4 font-semibold">Total</td>
              <td className="px-6 py-4 font-semibold">
                ${sortedIncomes.reduce((sum, income) => sum + parseFloat(income.amount), 0).toFixed(2)}
              </td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}