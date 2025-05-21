import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { useContract } from '../hooks/useContract';
import { loader } from '../assets';
import DonationForm from '../components/DonationForm';

const CampaignDetails = () => {
  const { id } = useParams();
  const { contract } = useContract();
  const [campaign, setCampaign] = useState(null);
  const [party, setParty] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCampaignDetails();
  }, [contract, id]);

  const loadCampaignDetails = async () => {
    try {
      if (!contract) return;

      const campaignData = await contract.getCampaign(id);
      const partyData = await contract.getParty(campaignData.partyId);
      
      setCampaign({
        id: id,
        name: campaignData.name,
        description: campaignData.description,
        goal: ethers.utils.formatEther(campaignData.goal),
        raised: ethers.utils.formatEther(campaignData.raised),
        deadline: new Date(campaignData.deadline * 1000),
        partyId: campaignData.partyId.toNumber(),
        creator: campaignData.creator,
        isActive: campaignData.isActive,
        isFunded: campaignData.isFunded
      });

      setParty({
        name: partyData.name,
        leader: partyData.leader
      });

      // Load donation events for this campaign
      const filter = contract.filters.CampaignFunded(id);
      const events = await contract.queryFilter(filter);
      
      const donationsList = await Promise.all(events.map(async (event) => {
        const block = await event.getBlock();
        return {
          donor: event.args.donor,
          amount: ethers.utils.formatEther(event.args.amount),
          timestamp: new Date(block.timestamp * 1000),
          transactionHash: event.transactionHash
        };
      }));

      setDonations(donationsList);
      setLoading(false);
    } catch (err) {
      console.error('Error loading campaign details:', err);
      setError('Failed to load campaign details');
      setLoading(false);
    }
  };

  const handleDonationSuccess = () => {
    loadCampaignDetails();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#13131a]">
        <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#13131a]">
        <p className="font-epilogue font-bold text-[20px] text-white text-center">
          {error || 'Campaign not found'}
        </p>
      </div>
    );
  }

  const progress = (parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100;

  return (
    <div className="bg-[#13131a] min-h-screen p-4 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#1c1c24] rounded-[20px] p-4 sm:p-8">
          {/* Campaign Header */}
          <div className="border-b border-[#3a3a43] pb-6">
            <h1 className="font-epilogue font-bold text-[25px] text-white">{campaign.name}</h1>
            <div className="mt-4">
              <label className="block text-[14px] font-medium text-white mb-2">Political Party</label>
              <p className="font-epilogue text-[16px] text-[#808191]">{party.name}</p>
            </div>
            <div className="mt-4">
              <label className="block text-[14px] font-medium text-white mb-2">Party Leader</label>
              <p className="font-epilogue text-[14px] text-[#808191]">{party.leader}</p>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="py-6 border-b border-[#3a3a43]">
            <div className="mb-6">
              <label className="block text-[14px] font-medium text-white mb-2">Description</label>
              <div className="font-epilogue text-[16px] text-[#808191] bg-transparent border border-[#3a3a43] rounded-[10px] py-3 px-4">
                <p>{campaign.description}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <label className="block text-[14px] font-medium text-white mb-4">Campaign Progress</label>
              <div className="bg-transparent border border-[#3a3a43] rounded-[10px] p-4">
                <div className="flex justify-between font-epilogue text-[14px] text-[#808191] mb-2">
                  <span>{campaign.raised} ETH raised</span>
                  <span>Goal: {campaign.goal} ETH</span>
                </div>
                <div className="w-full bg-[#3a3a43] rounded-full h-2.5">
                  <div
                    style={{ width: `${Math.min(progress, 100)}%` }}
                    className="bg-[#1dc071] h-2.5 rounded-full transition-all duration-700"
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <label className="block text-[14px] font-medium text-white mb-1">Status</label>
                    <span className={`px-4 py-1 rounded-[10px] text-[14px] ${
                      campaign.isActive 
                        ? campaign.isFunded 
                          ? 'bg-[#1dc071] text-white'
                          : 'bg-[#8c6dfd] text-white'
                        : 'bg-[#ed3f3f] text-white'
                    }`}>
                      {campaign.isActive 
                        ? campaign.isFunded 
                          ? 'Funded'
                          : 'Active'
                        : 'Closed'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-[14px] font-medium text-white mb-1">Deadline</label>
                    <p className="font-epilogue text-[14px] text-[#808191]">
                      {campaign.deadline.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Form */}
          {campaign.isActive && !campaign.isFunded && (
            <div className="py-6 border-b border-[#3a3a43]">
              <h2 className="block text-[20px] font-semibold text-white mb-4">Make a Donation</h2>
              <div className="bg-transparent border border-[#3a3a43] rounded-[10px] p-4">
                <DonationForm
                  campaignId={parseInt(id)}
                  onDonationSuccess={handleDonationSuccess}
                />
              </div>
            </div>
          )}

          {/* Donations Table */}
          <div className="py-6">
            <h2 className="block text-[20px] font-semibold text-white mb-6">Donation History</h2>
            {donations.length > 0 ? (
              <div className="bg-transparent border border-[#3a3a43] rounded-[10px] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#3a3a43]">
                    <tr>
                      <th className="font-epilogue text-[14px] text-white font-medium text-left px-6 py-3">
                        Donor Address
                      </th>
                      <th className="font-epilogue text-[14px] text-white font-medium text-left px-6 py-3">
                        Amount (ETH)
                      </th>
                      <th className="font-epilogue text-[14px] text-white font-medium text-left px-6 py-3">
                        Date
                      </th>
                      <th className="font-epilogue text-[14px] text-white font-medium text-left px-6 py-3">
                        Transaction
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3a3a43]">
                    {donations.map((donation, index) => (
                      <tr key={index} className="hover:bg-[#2c2f32] transition-colors duration-200">
                        <td className="font-epilogue text-[14px] text-[#808191] px-6 py-4 whitespace-nowrap">
                          {`${donation.donor.slice(0, 6)}...${donation.donor.slice(-4)}`}
                        </td>
                        <td className="font-epilogue text-[14px] text-[#808191] px-6 py-4 whitespace-nowrap">
                          {donation.amount}
                        </td>
                        <td className="font-epilogue text-[14px] text-[#808191] px-6 py-4 whitespace-nowrap">
                          {donation.timestamp.toLocaleString()}
                        </td>
                        <td className="font-epilogue text-[14px] px-6 py-4 whitespace-nowrap">
                          <a
                            href={`https://sepolia.etherscan.io/tx/${donation.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8c6dfd] hover:text-[#b2b3bd] transition-colors duration-200"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-transparent border border-[#3a3a43] rounded-[10px] p-4">
                <p className="font-epilogue text-[16px] text-[#808191]">No donations yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;