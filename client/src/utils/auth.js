import { useNavigate } from 'react-router-dom';

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  const navigate = useNavigate();
  navigate('/login');
};