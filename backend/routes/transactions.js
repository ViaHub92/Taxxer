const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all transactions for a user
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.userId })
      .sort({ date: -1 });
    
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { type, amount, category, description, date, taxDeductible } = req.body;
    
    const transaction = new Transaction({
      user: req.user.userId,
      type,
      amount,
      category,
      description,
      date: date || Date.now(),
      taxDeductible
    });
    
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const { type, amount, category, description, date, taxDeductible } = req.body;
    
    // Find and update transaction
    let transaction = await Transaction.findOne({ 
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    transaction.type = type || transaction.type;
    transaction.amount = amount || transaction.amount;
    transaction.category = category || transaction.category;
    transaction.description = description || transaction.description;
    transaction.date = date || transaction.date;
    transaction.taxDeductible = taxDeductible !== undefined ? taxDeductible : transaction.taxDeductible;
    
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ 
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    await transaction.remove();
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tax summary
router.get('/tax-summary', auth, async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);
    
    // Get all transactions for the year
    const transactions = await Transaction.find({
      user: req.user.userId,
      date: { $gte: startDate, $lte: endDate }
    });
    
    // Calculate totals
    let totalIncome = 0;
    let totalExpenses = 0;
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else if (transaction.type === 'expense' && transaction.taxDeductible) {
        totalExpenses += transaction.amount;
      }
    });
    
    const profit = totalIncome - totalExpenses;
    
    // Get user's tax rate
    const user = await User.findById(req.user.userId);
    const taxRate = user.taxInfo.taxRate || 0.25;
    
    const estimatedTax = profit * taxRate;
    
    res.json({
      year,
      totalIncome,
      totalExpenses,
      profit,
      taxRate,
      estimatedTax,
      transactions: transactions.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;