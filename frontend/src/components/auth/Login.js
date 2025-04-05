import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, error, clearErrors } = useContext(AuthContext);
  
  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  
  const [alert, setAlert] = useState('');
  
  const { email, password } = user;
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    if (error) {
      setAlert(error);
      clearErrors();
    }
  }, [isAuthenticated, error, navigate, clearErrors]);
  
  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });
  
  const onSubmit = e => {
    e.preventDefault();
    login({
      email,
      password
    });
  };
  
  return (
    <div className="form-container">
      <h1>Account Login</h1>
      {alert && <p className="alert">{alert}</p>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;