import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all spending records for the current user
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("spending");
    let results = await collection.find({ userId: req.user.userId }).toArray();
    res.send(results).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching spending records");
  }
});

// Add new spending record
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      userId: req.user.userId,
      date: new Date(req.body.date),
      amount: parseFloat(req.body.amount),
      category: req.body.category,
      description: req.body.description,
      paymentMethod: req.body.paymentMethod,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let collection = await db.collection("spending");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(201);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding spending record");
  }
});

// Update spending record
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        date: req.body.date ? new Date(req.body.date) : undefined,
        amount: req.body.amount ? parseFloat(req.body.amount) : undefined,
        category: req.body.category,
        description: req.body.description,
        paymentMethod: req.body.paymentMethod,
        updatedAt: new Date()
      }
    };

    Object.keys(updates.$set).forEach(key => {
      if (updates.$set[key] === undefined) {
        delete updates.$set[key];
      }
    });

    let collection = await db.collection("spending");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating spending record");
  }
});

// Delete spending record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("spending");
    let result = await collection.deleteOne(query);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting spending record");
  }
});

export default router;