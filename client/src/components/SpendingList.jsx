import { useState, useEffect } from "react";

export default function SpendingList() {
  const [spendings, setSpendings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSpendings();
  }, []);

  const fetchSpendings = async () => {
    try {
      const response = await fetch('http://localhost:5050/spending');
      if (!response.ok) throw new Error('Failed to fetch spendings');
      const data = await response.json();
      setSpendings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Spending History</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Deductible</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {spendings.map((spending) => (
              <tr key={spending._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(spending.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${parseFloat(spending.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">
                  {spending.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">
                  {spending.paymentMethod}
                </td>
                <td className="px-6 py-4">
                  {spending.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {spending.taxDeductible ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-4 font-semibold">Total</td>
              <td className="px-6 py-4 font-semibold">
                ${spendings.reduce((sum, spending) => sum + parseFloat(spending.amount), 0).toFixed(2)}
              </td>
              <td colSpan={4}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}