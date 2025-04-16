import express from "express";
import cors from "cors";
import income from "./routes/income.js";
import spending from "./routes/spending.js";
import users from "./routes/users.js";
import auth from "./middleware/auth.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to the Taxxer API');
});

app.use(cors({
  origin: ['https://taxxer.link', 'https://www.taxxer.link', 'http://localhost:5173', 'https://djdo9adcan9kl.cloudfront.net'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true 
}));
app.use(express.json());

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use("/users", users);

app.use("/income", auth, income);
app.use("/spending", auth, spending);


app.listen(5050, '0.0.0.0', () => {
  console.log('Server listening on port 5050');
});