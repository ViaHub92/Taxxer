import { useNavigate } from 'react-router-dom';

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Don't use window.location.href as it causes a full page reload
  const navigate = useNavigate();
  navigate('/login');
};