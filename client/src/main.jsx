import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import "./index.css";
import Home from "./components/Home";
import Login from "./components/Login";
import IncomeForm from "./components/IncomeForm";
import IncomeList from "./components/IncomeList";
import SpendingForm from "./components/SpendingForm";
import SpendingList from "./components/SpendingList";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element: <Register />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "/",
        element: <Home />
      },
      {
        path: "income",
        element: (
          <>
            <ProtectedRoute>
            <IncomeForm />
            <IncomeList />
            </ProtectedRoute>
          </>
        ),
      },
      {
        path: "spending",
        element: (
          <ProtectedRoute>
            <SpendingForm />
            <SpendingList />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);