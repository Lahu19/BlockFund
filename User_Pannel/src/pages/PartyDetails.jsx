import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useStateContext } from '../context';
import { ethers } from 'ethers';

const PartyDetails = () => {
  const { id } = useParams();
  const { getParty, makeDonation, getPartyDonations, withdrawFunds, user } = useStateContext();
  const [party, setParty] = useState(null);
  const [donations, setDonations] = useState([]);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPartyDetails = async () => {
      try {
        const partyData = await getParty(id);
        if (partyData) {
          setParty(partyData);
          const donationsData = await getPartyDonations(id);
          setDonations(donationsData);
        }
      } catch (error) {
        console.error('Error fetching party details:', error);
        toast.error('Error fetching party details: ' + error.message);
      }
    };

    if (id) {
      fetchPartyDetails();
    }
  }, [id, getParty, getPartyDonations]);

  const handleDonation = async (e) => {
    e.preventDefault();
    if (!user?.isKycVerified) {
      toast.error('You must be KYC verified to make donations');
      return;
    }

    try {
      setIsLoading(true);
      await makeDonation(id, donationAmount, donationMessage);
      setDonationAmount('');
      setDonationMessage('');
      
      // Refresh party details and donations
      const partyData = await getParty(id);
      setParty(partyData);
      const donationsData = await getPartyDonations(id);
      setDonations(donationsData);
      
      toast.success('Donation made successfully!');
    } catch (error) {
      console.error('Error making donation:', error);
      toast.error('Error making donation: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!party) return;
    
    // Check if the current user is the party leader
    if (user?.address !== party.leaderAddress) {
      toast.error('Only the party leader can withdraw funds');
      return;
    }
    
    try {
      setIsLoading(true);
      await withdrawFunds(id);
      
      // Refresh party details
      const partyData = await getParty(id);
      setParty(partyData);
      
      toast.success('Funds withdrawn successfully!');
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      toast.error('Error withdrawing funds: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!party) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#1dc071]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {party ? (
        <>
          <div className="bg-[#1c1c24] rounded-[10px] p-4 sm:p-6">
            <h1 className="text-[20px] sm:text-[24px] font-bold text-white mb-4">{party.name}</h1>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-[14px] text-gray-400">Leader</p>
                <p className="text-[16px] text-white">{party.leader}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[14px] text-gray-400">Registration Number</p>
                <p className="text-[16px] text-white">{party.registrationNumber}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[14px] text-gray-400">Total Donations</p>
                <p className="text-[16px] text-white">{ethers.utils.formatEther(party.totalDonations.toString())} ETH</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[14px] text-gray-400">Status</p>
                <p className="text-[16px] text-white">{party.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[14px] text-gray-400">Leader's Ethereum Address</p>
                <p className="text-[16px] text-white">{party.leaderAddress}</p>
              </div>
              
              {/* Withdraw button - only visible to party leader */}
              {user?.address === party.leaderAddress && party.totalDonations.toString() !== '0' && (
                <button
                  onClick={handleWithdraw}
                  disabled={isLoading}
                  className="bg-[#1dc071] hover:bg-[#1aa065] text-white font-bold py-2 px-4 rounded"
                >
                  {isLoading ? 'Withdrawing...' : 'Withdraw Funds'}
                </button>
              )}
            </div>
          </div>

          <div className="bg-[#1c1c24] rounded-[10px] p-4 sm:p-6">
            <h2 className="text-[18px] sm:text-[20px] font-bold text-white mb-4">Make a Donation</h2>
            <form onSubmit={handleDonation} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-gray-400">Amount (ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="bg-[#2c2c34] text-white rounded-[10px] p-2"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-gray-400">Message (Optional)</label>
                <textarea
                  value={donationMessage}
                  onChange={(e) => setDonationMessage(e.target.value)}
                  className="bg-[#2c2c34] text-white rounded-[10px] p-2"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#1dc071] hover:bg-[#1aa065] text-white font-bold py-2 px-4 rounded"
              >
                {isLoading ? 'Processing...' : 'Donate'}
              </button>
            </form>
          </div>

          <div className="bg-[#1c1c24] rounded-[10px] p-4 sm:p-6">
            <h2 className="text-[18px] sm:text-[20px] font-bold text-white mb-4">Recent Donations</h2>
            {donations.length > 0 ? (
              <div className="flex flex-col gap-4">
                {donations.map((donation, index) => (
                  <div key={index} className="bg-[#2c2c34] rounded-[10px] p-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[14px] text-gray-400">Donor</p>
                      <p className="text-[14px] text-white">{donation.donor.substring(0, 6)}...{donation.donor.substring(38)}</p>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[14px] text-gray-400">Amount</p>
                      <p className="text-[14px] text-white">{ethers.utils.formatEther(donation.amount.toString())} ETH</p>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[14px] text-gray-400">Date</p>
                      <p className="text-[14px] text-white">{new Date(donation.timestamp * 1000).toLocaleDateString()}</p>
                    </div>
                    {donation.message && (
                      <div className="flex flex-col gap-1">
                        <p className="text-[14px] text-gray-400">Message</p>
                        <p className="text-[14px] text-white">{donation.message}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[14px] text-gray-400">No donations yet</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-[16px] text-white">Loading party details...</p>
      )}
    </div>
  );
};

export default PartyDetails; 