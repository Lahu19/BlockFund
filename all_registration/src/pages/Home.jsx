import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-8">Welcome to Political Party Fund</h1>
      <div className="space-x-4">
        <Link 
          to="/login" 
          className="bg-[#1dc071] hover:bg-[#2de081] text-white font-bold py-2 px-6 rounded"
        >
          Login
        </Link>
        <Link 
          to="/register" 
          className="bg-[#8c6dfd] hover:bg-[#9d7eff] text-white font-bold py-2 px-6 rounded"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;