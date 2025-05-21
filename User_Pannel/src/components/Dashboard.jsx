import React, { useState } from 'react';
import NetworkStatus from './NetworkStatus';
import PartyRegistrationForm from './forms/PartyRegistrationForm';
import UserRegistrationForm from './forms/UserRegistrationForm';
import DonationForm from './forms/DonationForm';
import CampaignForm from './forms/CampaignForm';
import { useWeb3Contract } from '../hooks/useWeb3Contract';

const Dashboard = () => {
  const [activeForm, setActiveForm] = useState('campaign');
  const { account, error, isCorrectNetwork } = useWeb3Contract();

  const renderForm = () => {
    switch (activeForm) {
      case 'party':
        return <PartyRegistrationForm />;
      case 'user':
        return <UserRegistrationForm />;
      case 'donation':
        return <DonationForm />;
      case 'campaign':
        return <CampaignForm />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#13131a]">
      <NetworkStatus />
      
      {/* Navigation */}
      <nav className="bg-[#1c1c24] shadow-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveForm('party')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-epilogue font-medium ${
                    activeForm === 'party'
                      ? 'border-[#1dc071] text-white'
                      : 'border-transparent text-[#808191] hover:border-[#3a3a43] hover:text-[#b2b3bd]'
                  }`}
                >
                  Register Party
                </button>
                <button
                  onClick={() => setActiveForm('user')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-epilogue font-medium ${
                    activeForm === 'user'
                      ? 'border-[#1dc071] text-white'
                      : 'border-transparent text-[#808191] hover:border-[#3a3a43] hover:text-[#b2b3bd]'
                  }`}
                >
                  Register User
                </button>
                <button
                  onClick={() => setActiveForm('donation')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-epilogue font-medium ${
                    activeForm === 'donation'
                      ? 'border-[#1dc071] text-white'
                      : 'border-transparent text-[#808191] hover:border-[#3a3a43] hover:text-[#b2b3bd]'
                  }`}
                >
                  Make Donation
                </button>
                <button
                  onClick={() => setActiveForm('campaign')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-epilogue font-medium ${
                    activeForm === 'campaign'
                      ? 'border-[#1dc071] text-white'
                      : 'border-transparent text-[#808191] hover:border-[#3a3a43] hover:text-[#b2b3bd]'
                  }`}
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : !isCorrectNetwork ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please connect to the correct network to continue.
                </p>
              </div>
            </div>
          </div>
        ) : !account ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please connect your wallet to continue.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg">
            {renderForm()}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 