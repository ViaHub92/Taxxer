import express from "express";
import cors from "cors";
import income from "./routes/income.js";
import spending from "./routes/spending.js";
import users from "./routes/users.js";
import auth from "./middleware/auth.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", users);

app.use("/income", auth, income);
app.use("/spending", auth, spending);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});