import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all income records
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("income");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching income records");
  }
});

// Get a single income record by id
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("income");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching income record");
  }
});

// Create a new income record
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      date: new Date(req.body.date),
      amount: parseFloat(req.body.amount),
      category: req.body.category,
      description: req.body.description,
      taxable: req.body.taxable || true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let collection = await db.collection("income");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(201);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding income record");
  }
});

// Update an income record
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        date: req.body.date ? new Date(req.body.date) : undefined,
        amount: req.body.amount ? parseFloat(req.body.amount) : undefined,
        category: req.body.category,
        description: req.body.description,
        taxable: req.body.taxable,
        updatedAt: new Date()
      }
    };

    // Remove undefined fields
    Object.keys(updates.$set).forEach(key => {
      if (updates.$set[key] === undefined) {
        delete updates.$set[key];
      }
    });

    let collection = await db.collection("income");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating income record");
  }
});

// Delete an income record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("income");
    let result = await collection.deleteOne(query);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting income record");
  }
});

// Get total income for a date range
router.get("/summary/range", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let collection = await db.collection("income");
    
    let query = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    let result = await collection.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    res.send(result[0] || { totalIncome: 0, count: 0 }).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching income summary");
  }
});

export default router;