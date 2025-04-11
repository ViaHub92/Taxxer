import express from "express";
import cors from "cors";
import income from "./routes/income.js";
import spending from "./routes/spending.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/income", income);
app.use("/spending", spending);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});