import { useState, useEffect } from "react";

function IncomeList() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await fetch('http://localhost:5050/income');
      if (!response.ok) throw new Error('Failed to fetch incomes');
      const data = await response.json();
      setIncomes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl mb-4">Income History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Taxable</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income) => (
              <tr key={income._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  {new Date(income.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  ${parseFloat(income.amount).toFixed(2)}
                </td>
                <td className="px-4 py-2 capitalize">{income.category}</td>
                <td className="px-4 py-2">{income.description}</td>
                <td className="px-4 py-2">
                  {income.taxable ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold">
              <td className="px-4 py-2">Total</td>
              <td className="px-4 py-2">
                ${incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0).toFixed(2)}
              </td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default IncomeList;