import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await login(formData);
      
      if (response.success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#1c1c24]">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#2c2c34] rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Login</h2>
          <p className="mt-2 text-gray-400">Welcome back!</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-white">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleFormFieldChange('email', e)}
                className="w-full px-4 py-2 mt-1 text-white bg-[#3a3a43] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1dc071]"
                required
              />
            </div>

            <div>
              <label className="text-white">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleFormFieldChange('password', e)}
                className="w-full px-4 py-2 mt-1 text-white bg-[#3a3a43] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1dc071]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-[#1dc071] rounded-lg hover:bg-[#0ab15b] focus:outline-none focus:ring-2 focus:ring-[#1dc071] disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#1dc071] hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
