import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <nav className="flex justify-between items-center mb-6 px-4 py-2">
        <div className="flex items-center">
          <NavLink to="/">
            <img src="/bestlogo.png" alt="Taxxer Logo" className="h-30 w-auto" />
          </NavLink>
          {isAuthenticated && (
            <div className="ml-8 flex items-center space-x-4">
              <NavLink 
                to="/income" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`
                }
              >
                Income
              </NavLink>
              <NavLink 
                to="/spending"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`
                }
              >
                Spending
              </NavLink>
              <NavLink 
                to="/tax-summary"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`
                }
              >
                Tax Summary
              </NavLink>
            </div>
          )}
        </div>

        <div className="flex items-center">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-2">
              <NavLink 
                to="/login"
                className={({ isActive }) => 
                  `px-4 py-2 text-sm rounded-md ${isActive ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`
                }
              >
                Login
              </NavLink>
              <NavLink 
                to="/register"
                className={({ isActive }) => 
                  `px-4 py-2 text-sm text-white rounded-md ${isActive ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'}`
                }
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}