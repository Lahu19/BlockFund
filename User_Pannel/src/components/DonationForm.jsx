import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useContract } from '../hooks/useContract';

const DonationForm = ({ campaignId, partyId, onDonationSuccess }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { contract } = useContract();

  const handleDonation = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!contract) throw new Error('Contract not initialized');
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }

      const amountInWei = ethers.utils.parseEther(amount);
      
      // If donating to a campaign
      if (campaignId !== undefined) {
        const tx = await contract.fundCampaign(campaignId, {
          value: amountInWei
        });
        await tx.wait();
      } 
      // If donating directly to a party
      else if (partyId !== undefined) {
        const tx = await contract.makeDonation(partyId, message, {
          value: amountInWei
        });
        await tx.wait();
      }

      setAmount('');
      setMessage('');
      if (onDonationSuccess) {
        onDonationSuccess();
      }
    } catch (err) {
      console.error('Donation error:', err);
      setError(err.message || 'Failed to make donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleDonation} className="space-y-6">
      <div>
        <label htmlFor="amount" className="block text-[14px] font-medium text-white mb-2">
          Amount (ETH)
        </label>
        <input
          type="number"
          id="amount"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={`mt-1 block w-full bg-transparent border rounded-[10px] py-3 px-4 text-white placeholder-[#4b5264] focus:outline-none focus:ring-2 focus:ring-[#1dc071] ${
            error ? 'border-[#ed3f3f]' : 'border-[#3a3a43]'
          }`}
          placeholder="0.0"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-[14px] font-medium text-white mb-2">
          Message (optional)
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`mt-1 block w-full bg-transparent border rounded-[10px] py-3 px-4 text-white placeholder-[#4b5264] focus:outline-none focus:ring-2 focus:ring-[#1dc071] ${
            error ? 'border-[#ed3f3f]' : 'border-[#3a3a43]'
          }`}
          rows="3"
          placeholder="Add a message with your donation"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="text-[#ed3f3f] text-[14px] mt-2">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${
          loading
            ? 'bg-[#4b5264] cursor-not-allowed'
            : 'bg-[#1dc071] hover:bg-[#19a862] transition-colors duration-200'
        }`}
      >
        {loading ? 'Processing...' : 'Make Donation'}
      </button>
    </form>
  );
};

export default DonationForm; 