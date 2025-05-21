import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStateContext } from './context';
import { Sidebar, Navbar, CustomSidebar } from './components';
import { CampaignDetails, Home, Campaigns, Donations, PoliticalParties, KycVerifiedUsers } from './pages';
import CampaignForm from './components/forms/CampaignForm';
import DonationForm from './components/forms/DonationForm';
import KycVerificationForm from './components/forms/KycVerificationForm';
import PartyRegistrationForm from './components/forms/PartyRegistrationForm';
import PartyList from './components/PartyList';
import { useContract } from './hooks/useContract';
import Login from './pages/Login';
import RegistrationOfUser from './pages/RegistrationOfUser';

const App = () => {
  const { isWalletConnected, connectWallet } = useStateContext();
  const { error } = useContract();
  const [useCustomSidebar, setUseCustomSidebar] = useState(true);

  if (!isWalletConnected) {
    return (
      <div className="bg-[#13131a] min-h-screen flex items-center justify-center">
        <div className="bg-[#1c1c24] p-8 rounded-lg text-center">
          <h2 className="text-white text-2xl mb-4">Welcome to CrowdFunding</h2>
          <p className="text-gray-400 mb-6">Please connect your MetaMask wallet to continue</p>
          <button 
            onClick={connectWallet}
            className="bg-[#8c6dfd] text-white px-6 py-3 rounded-lg hover:bg-[#7c5dfd]"
          >
            Connect MetaMask
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      {/* <div className="sm:flex hidden mr-10 relative">
        {useCustomSidebar ? <CustomSidebar /> : <Sidebar />}
      </div> */}

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />
        
        <Routes>
          {/* <Route path="/" element={<Login/>} /> */}
          {/* <Route path='/register' element={<RegistrationOfUser/>}/> */}
          {/* <Route path='/dashboard' element={<Home />}/> */}
          <Route path="/" element={<Campaigns />} />
          {/* <Route path="/donations" element={<Donations />} /> */}
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
          {/* <Route path="/campaigns/new" element={<CampaignForm />} />
          <Route path="/donate" element={<DonationForm />} />
          <Route path="/kyc-verification" element={<KycVerificationForm />} />
          <Route path="/party-registration" element={<PartyRegistrationForm />} />
          <Route path="/political-parties" element={<PoliticalParties />} />
          <Route path="/kyc-users" element={<KycVerifiedUsers />} /> */}
        </Routes>

        
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default App;