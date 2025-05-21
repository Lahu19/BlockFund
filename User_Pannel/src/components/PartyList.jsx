import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useContract } from '../hooks/useContract';

const PartyList = () => {
  const navigate = useNavigate();
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { contract } = useContract();

  useEffect(() => {
    loadParties();
  }, [contract]);

  const loadParties = async () => {
    try {
      if (!contract) return;
      
      const partyCount = await contract.partyCount();
      const partiesData = [];

      for (let i = 1; i <= partyCount; i++) {
        const party = await contract.getParty(i);
        const campaigns = await loadPartyCampaigns(i);
        
        partiesData.push({
          id: i,
          name: party.name,
          leader: party.leader,
          registrationNumber: party.registrationNumber,
          totalDonations: ethers.utils.formatEther(party.totalDonations),
          isActive: party.isActive,
          leaderAddress: party.leaderAddress,
          campaigns: campaigns
        });
      }

      setParties(partiesData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading parties:', error);
      setLoading(false);
    }
  };

  const loadPartyCampaigns = async (partyId) => {
    const campaignCount = await contract.campaignCount();
    const campaigns = [];

    for (let i = 0; i < campaignCount; i++) {
      const campaign = await contract.getCampaign(i);
      if (campaign.partyId.toNumber() === partyId) {
        campaigns.push({
          id: i,
          name: campaign.name,
          description: campaign.description,
          goal: ethers.utils.formatEther(campaign.goal),
          raised: ethers.utils.formatEther(campaign.raised),
          deadline: new Date(campaign.deadline * 1000).toLocaleDateString(),
          isActive: campaign.isActive,
          isFunded: campaign.isFunded
        });
      }
    }

    return campaigns;
  };

  const handleCampaignClick = (campaignId) => {
    navigate(`/campaign-details/${campaignId}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading parties...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Political Parties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parties.map((party) => (
          <div key={party.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">{party.name}</h3>
              <p className="text-gray-600">Leader: {party.leader}</p>
              <p className="text-gray-600">
                Total Donations: {party.totalDonations} ETH
              </p>
              <span className={`px-2 py-1 rounded text-sm ${
                party.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {party.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Active Campaigns</h4>
              {party.campaigns.length > 0 ? (
                <div className="space-y-4">
                  {party.campaigns.filter(c => c.isActive).map((campaign) => (
                    <div
                      key={campaign.id}
                      className="border rounded p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => handleCampaignClick(campaign.id)}
                    >
                      <h5 className="font-medium">{campaign.name}</h5>
                      <p className="text-sm text-gray-600">{campaign.description}</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Goal: {campaign.goal} ETH</span>
                          <span>Raised: {campaign.raised} ETH</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{
                              width: `${Math.min(
                                (parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Deadline: {campaign.deadline}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No active campaigns</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartyList; 