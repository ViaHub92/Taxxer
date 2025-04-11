import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import IncomeForm from "./components/IncomeForm";
import IncomeList from "./components/IncomeList";

const App = () => {
  return (
    <div className="w-full p-6">
      <Navbar />
      <IncomeForm />
      <IncomeList />
      <Outlet />
    </div>
  );
};
export default App;