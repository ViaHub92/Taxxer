# Taxxer
A web application for tracking income, expenses, and calculating estimated taxes. Taxxer helps you maintain financial records and provides tax insights through an intuitive interface.

## 🌟 Features

- 👤 User Authentication (Register/Login)
- 💰 Income Tracking
- 💳 Expense Management
- 📊 Tax Summary Dashboard
- 📅 Monthly and Yearly Financial Overview
- 🔒 Secure Data Storage
- 📱 Responsive Design

## 🚀 Getting Started

Follow these steps to run the project locally:

### Prerequisites

- Node.js
- MongoDB
- Git

### 📁 Environment Setup

1. Create a `config.env` file in the server directory with:
```env
ATLAS_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5050
```

### 🖥️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/taxxer.git
cd taxxer
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

### 🚀 Running the Application

1. Start the server:
```bash
cd server
node --env-file=config.env server
```

2. In a new terminal, start the client:
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## 💻 Tech Stack

- **Frontend:**
  - React
  - React Router
  - Tailwind CSS
  - Framer Motion

- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication

## 📋 Features Available

- [x] User Registration and Authentication
- [x] Income Recording and Tracking
- [x] Expense Management
- [x] Monthly/Yearly Tax Calculations
- [x] Detailed Transaction History
- [x] Protected Routes
- [x] Responsive Design

## 🔜 Coming Soon

- [ ] Advanced Tax Bracket Calculations
- [ ] Data Export Functionality
- [ ] Tax Form Generation
- [ ] User Profile Management
- [ ] Multiple Currency Support