import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="flex justify-between items-center mb-6 px-4 py-2">
        <NavLink to="/">
          <img src="/logo.png" alt="Taxxer Logo" className="h-30 w-auto" />
        </NavLink>
      </nav>
    </div>
  );
}