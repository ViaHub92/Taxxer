import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import "./index.css";
import IncomeForm from "./components/IncomeForm";
import IncomeList from "./components/IncomeList";
import SpendingForm from "./components/SpendingForm";
import SpendingList from "./components/SpendingList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <div>Welcome to Taxxer</div>,
      },
      {
        path: "income",
        element: (
          <>
            <IncomeForm />
            <IncomeList />
          </>
        ),
      },
      {
        path: "spending",
        element: (
          <>
            <SpendingForm />
            <SpendingList />
          </>
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