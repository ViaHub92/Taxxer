import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.ATLAS_URI) {
  throw new Error("Missing ATLAS_URI environment variable");
}

const client = new MongoClient(process.env.ATLAS_URI);

let conn;
try {
  conn = await client.connect();
  console.log("Successfully connected to MongoDB.");
} catch(e) {
  console.error("Error connecting to MongoDB:", e);
  throw e;
}

let db = conn.db("taxxer");

export default db;