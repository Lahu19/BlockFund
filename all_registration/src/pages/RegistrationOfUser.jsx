import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegistrationOfUser = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userRole: 'donor' // default role
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration data:', formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-[#1c1c24] p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#13131a] text-white border border-gray-700 focus:border-[#1dc071] focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#13131a] text-white border border-gray-700 focus:border-[#1dc071] focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#13131a] text-white border border-gray-700 focus:border-[#1dc071] focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#13131a] text-white border border-gray-700 focus:border-[#1dc071] focus:outline-none"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              User Role
            </label>
            <select
              name="userRole"
              value={formData.userRole}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#13131a] text-white border border-gray-700 focus:border-[#1dc071] focus:outline-none"
              required
            >
              <option value="donor">Donor</option>
              <option value="politician">Politician</option>
              <option value="auditor">Auditor</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-[#1dc071] hover:bg-[#2de081] text-white font-bold py-3 px-4 rounded"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#8c6dfd] hover:text-[#9d7eff]">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationOfUser;
