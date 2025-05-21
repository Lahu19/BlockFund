import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CustomButton, FormField, Loader } from '../components';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const RegistrationOfUser = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone_number: '',
    masked_aadhaar: '',
    pan_number: '',
    user_role: 'user'
  });

  const handleFormFieldChange = (fieldName, e) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.full_name || !formData.email || !formData.password || 
        !formData.phone_number || !formData.masked_aadhaar || !formData.pan_number) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone_number)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    // Aadhaar validation
    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(formData.masked_aadhaar)) {
      toast.error('Please enter a valid 12-digit Aadhaar number');
      return false;
    }

    // PAN validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.pan_number.toUpperCase())) {
      toast.error('Please enter a valid PAN number (e.g., ABCDE1234F)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await register(formData);

      if (response.success) {
        toast.success('Registration successful!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#1c1c24]">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#2c2c34] rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Register</h2>
          <p className="mt-2 text-gray-400">Create your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-white">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleFormFieldChange('full_name', e)}
                className="w-full px-4 py-2 mt-1 text-white bg-[#3a3a43] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1dc071]"
                required
              />
            </div>

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

            <div>
              <label className="text-white">Confirm Password</label>
              <input
                type="password"
                value={formData.confirm_password}
                onChange={(e) => handleFormFieldChange('confirm_password', e)}
                className="w-full px-4 py-2 mt-1 text-white bg-[#3a3a43] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1dc071]"
                required
              />
            </div>

            <div>
              <label className="text-white">Phone Number</label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => handleFormFieldChange('phone_number', e)}
                className="w-full px-4 py-2 mt-1 text-white bg-[#3a3a43] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1dc071]"
                required
              />
            </div>

            <div>
              <label className="text-white">Aadhaar Number</label>
              <input
                type="text"
                value={formData.masked_aadhaar}
                onChange={(e) => handleFormFieldChange('masked_aadhaar', e)}
                className="w-full px-4 py-2 mt-1 text-white bg-[#3a3a43] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1dc071]"
                required
              />
            </div>

            <div>
              <label className="text-white">PAN Number</label>
              <input
                type="text"
                value={formData.pan_number}
                onChange={(e) => handleFormFieldChange('pan_number', e)}
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
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1dc071] hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationOfUser;
