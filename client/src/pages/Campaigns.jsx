import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useContract } from '../hooks/useContract';
import { loader } from '../assets';
import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';

const Campaigns = () => {
  const navigate = useNavigate();
  const { address } = useStateContext();
  const { contract } = useContract();
  const [isLoading, setIsLoading] = useState(true);
  const [parties, setParties] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    if (contract) {
      loadPartiesAndCampaigns();
    }
  }, [contract]);

  const loadPartiesAndCampaigns = async () => {
    try {
      setIsLoading(true);
      
      // Load parties
      const partyCount = await contract.partyCount();
      const partiesData = [];

      for (let i = 1; i <= partyCount; i++) {
        const party = await contract.getParty(i);
        partiesData.push({
          id: i,
          name: party.name,
          leader: party.leader,
          registrationNumber: party.registrationNumber,
          totalDonations: ethers.utils.formatEther(party.totalDonations),
          isActive: party.isActive,
          leaderAddress: party.leaderAddress
        });
      }

      // Load campaigns for each party
      const campaignCount = await contract.campaignCount();
      const campaignsData = [];

      for (let i = 0; i < campaignCount; i++) {
        const campaign = await contract.getCampaign(i);
        const party = partiesData.find(p => p.id === campaign.partyId.toNumber());
        
        if (campaign.isActive) {
          campaignsData.push({
            id: i,
            name: campaign.name,
            description: campaign.description,
            goal: ethers.utils.formatEther(campaign.goal),
            raised: ethers.utils.formatEther(campaign.raised),
            deadline: new Date(campaign.deadline * 1000).toLocaleDateString(),
            isActive: campaign.isActive,
            isFunded: campaign.isFunded,
            partyName: party ? party.name : 'Unknown Party'
          });
        }
      }

      setParties(partiesData);
      setCampaigns(campaignsData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  const handleCampaignClick = (campaignId) => {
    navigate(`/campaign-details/${campaignId}`);
  };

  return (
    <div className="bg-[#1c1c24] flex flex-col gap-8 rounded-[10px] sm:p-10 p-4">
      {/* Political Parties Section */}
      <div>
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Political Parties
        </h1>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center">
              <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
            </div>
          ) : parties.map((party) => (
            <div key={party.id} className="bg-[#3a3a43] rounded-lg p-6">
              <h3 className="text-white text-xl font-semibold mb-2">{party.name}</h3>
              <p className="text-gray-300">Leader: {party.leader}</p>
              <p className="text-gray-300">Total Donations: {party.totalDonations} ETH</p>
              <div className="mt-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  party.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {party.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaigns Section */}
      <div className="mt-8">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white mb-6">
          Active Campaigns
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center">
              <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
            </div>
          ) : campaigns.length === 0 ? (
            <p className="col-span-full text-center text-gray-400">No active campaigns found</p>
          ) : (
            campaigns.map((campaign) => (
              <div 
                key={campaign.id} 
                className="bg-[#3a3a43] rounded-lg p-6 cursor-pointer transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg"
                onClick={() => handleCampaignClick(campaign.id)}
              >
                <h3 className="text-white text-xl font-semibold mb-2">{campaign.name}</h3>
                <p className="text-gray-300 text-sm mb-2">{campaign.description}</p>
                <p className="text-gray-300">Party: {campaign.partyName}</p>
                <div className="mt-4">
                  <div className="flex justify-between text-gray-300 text-sm mb-2">
                    <span>Goal: {campaign.goal} ETH</span>
                    <span>Raised: {campaign.raised} ETH</span>
                  </div>
                  <div className="w-full bg-[#2c2f32] rounded-full h-2">
                    <div
                      className="bg-[#8c6dfd] h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          (parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100,
                          100
                        )}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">
                    Deadline: {campaign.deadline}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Campaigns; 