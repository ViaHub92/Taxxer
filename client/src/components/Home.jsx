import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-blue-600 mb-6">
          Track. Save. <span className="text-green-500">Relax.</span>
        </h1>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-lg shadow-lg"
          >
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Easy Tracking</h3>
            <p className="text-gray-600">Record your financial transactions with just a few clicks</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-lg shadow-lg"
          >
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Tax Insights</h3>
            <p className="text-gray-600">Get real-time tax estimates and deduction tracking</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white rounded-lg shadow-lg"
          >
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">Always Available</h3>
            <p className="text-gray-600">Access your financial data anywhere, anytime</p>
          </motion.div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            to="/income"
            className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            Track Income
          </Link>
          <Link
            to="/spending"
            className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-colors"
          >
            Record Expenses
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <p className="text-sm text-gray-500">
          &copy; 2025 Taxxer. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}