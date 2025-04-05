import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, error, clearErrors } = useContext(AuthContext);

  const [user, setUser] = useState({
    email: '',
    password: '',
    password2: '',
    businessName: '',
    businessType: ''
  });

  const [alert, setAlert] = useState('');

  const { email, password, password2, businessName, businessType } = user;

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
    
    if (password !== password2) {
      setAlert('Passwords do not match');
    } else if (!businessName || !businessType) {
      setAlert('Please provide your business information');
    } else {
      register({
        email,
        password,
        businessName,
        businessType
      });
    }
  };

  return (
    <div className="form-container">
      <h1>Account Register</h1>
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
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            name="password2"
            value={password2}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="businessName">Business Name</label>
          <input
            type="text"
            name="businessName"
            value={businessName}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="businessType">Business Type</label>
          <select
            name="businessType"
            value={businessType}
            onChange={onChange}
            required
          >
            <option value="">Select Business Type</option>
            <option value="Sole Proprietorship">Sole Proprietorship</option>
            <option value="Partnership">Partnership</option>
            <option value="LLC">LLC</option>
            <option value="Corporation">Corporation</option>
            <option value="Freelancer">Freelancer</option>
          </select>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;