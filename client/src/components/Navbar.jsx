import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="flex justify-between items-center mb-6 px-4 py-2">
        <NavLink to="/">
          <img src="/logo.png" alt="Taxxer Logo" className="h-30 w-auto" />
        </NavLink>
        <div className="flex gap-4">
          <NavLink 
            to="/income"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600"
            }
          >
            Income
          </NavLink>
          <NavLink 
            to="/spending"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600"
            }
          >
            Spending
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
