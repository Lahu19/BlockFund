import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context';
import { DisplayCampaigns } from '../components';
import { loader } from '../assets';
import { useContract } from '../hooks/useContract';
import { ethers } from 'ethers';

const StatCard = ({ title, value, bgColor }) => (
  <div className={`${bgColor} rounded-[20px] p-4 min-w-[200px]`}>
    <h3 className="font-epilogue font-semibold text-[14px] text-white leading-[22px]">
      {title}
    </h3>
    <p className="font-epilogue font-bold text-[28px] text-white leading-[38px] mt-2">
      {value}
    </p>
  </div>
);

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalParties: 4,
    totalCampaigns: 2,
    activeCampaigns: 7,
    kycUsers: 10,
    totalDonations: '15'
  });

  const { contract } = useContract();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      if (!contract) return;

      // Get total parties
      const partyCount = await contract.partyCount();
      
      // Get campaigns data
      const campaignCount = await contract.campaignCount();
      const campaignsData = [];
      let activeCampaignsCount = 0;
      let totalDonations = ethers.BigNumber.from('0');

      for (let i = 0; i < campaignCount; i++) {
        const campaign = await contract.getCampaign(i);
        if (campaign.isActive) {
          activeCampaignsCount++;
          campaignsData.push({
            id: i,
            name: campaign.name,
            description: campaign.description,
            goal: ethers.utils.formatEther(campaign.goal),
            raised: ethers.utils.formatEther(campaign.raised),
            deadline: new Date(campaign.deadline * 1000),
            partyId: campaign.partyId.toNumber(),
            isActive: campaign.isActive,
            isFunded: campaign.isFunded
          });
        }
        totalDonations = totalDonations.add(campaign.raised);
      }

      // Get KYC verified users count
      const kycUsersCount = await contract.getKYCVerifiedUsersCount();

      setStats({
        totalParties: partyCount.toString(),
        totalCampaigns: campaignCount.toString(),
        activeCampaigns: activeCampaignsCount,
        kycUsers: kycUsersCount.toString(),
        totalDonations: ethers.utils.formatEther(totalDonations)
      });

      setCampaigns(campaignsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchDashboardData();
    }
  }, [contract]);

  return (
    <div className="bg-[#1c1c24] flex flex-col gap-6 rounded-[20px] p-4 sm:p-8">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        </div>
      ) : (
        <>
          {/* Stats Section */}
          <div>
            <h1 className="font-epilogue font-bold text-[25px] text-white mb-6">
              Dashboard Overview
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <StatCard
                title="Total Political Parties"
                value={stats.totalParties}
                bgColor="bg-[#8c6dfd]"
              />
              <StatCard
                title="Total Campaigns"
                value={stats.totalCampaigns}
                bgColor="bg-[#1dc071]"
              />
              <StatCard
                title="Active Campaigns"
                value={stats.activeCampaigns}
                bgColor="bg-[#4acd8d]"
              />
              <StatCard
                title="KYC Verified Users"
                value={stats.kycUsers}
                bgColor="bg-[#2c2f32]"
              />
              <StatCard
                title="Total Donations (ETH)"
                value={parseFloat(stats.totalDonations).toFixed(2)}
                bgColor="bg-[#b2b3bd]"
              />
            </div>
          </div>

          {/* Active Campaigns Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-epilogue font-bold text-[20px] text-white">
                Active Campaigns
              </h2>
              <p className="font-epilogue text-[14px] text-[#808191]">
                {campaigns.length} campaign(s) found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div 
                  key={campaign.id} 
                  className="bg-[#3a3a43] rounded-[15px] p-4 cursor-pointer hover:bg-[#2c2f32] transition-all duration-200"
                  onClick={() => window.location.href = `/campaign-details/${campaign.id}`}
                >
                  <h3 className="font-epilogue font-semibold text-[16px] text-white mb-2">
                    {campaign.name}
                  </h3>
                  <p className="font-epilogue text-[14px] text-[#808191] mb-4 line-clamp-2">
                    {campaign.description}
                  </p>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-epilogue text-[14px] text-[#b2b3bd]">Progress</span>
                      <span className="font-epilogue text-[14px] text-[#808191]">
                        {((parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-[#2c2f32] rounded-full h-2">
                      <div
                        className="bg-[#1dc071] h-2 rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(
                            (parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100,
                            100
                          )}%`
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <p className="font-epilogue text-[14px] text-[#b2b3bd]">Raised</p>
                        <p className="font-epilogue font-semibold text-[16px] text-white">
                          {campaign.raised} ETH
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-epilogue text-[14px] text-[#b2b3bd]">Goal</p>
                        <p className="font-epilogue font-semibold text-[16px] text-white">
                          {campaign.goal} ETH
                        </p>
                      </div>
                    </div>
                    <p className="font-epilogue text-[12px] text-[#808191] mt-2">
                      Deadline: {campaign.deadline.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;