import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useWeb3Contract } from '../../hooks/useWeb3Contract';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

const DonationForm = () => {
  const { contract, account, error: web3Error, connectWallet } = useWeb3Contract();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    const checkMetaMask = async () => {
      const isInstalled = typeof window.ethereum !== 'undefined';
      setIsMetaMaskInstalled(isInstalled);
      
      if (isInstalled && !account) {
        try {
          await connectWallet();
        } catch (error) {
          console.error('Failed to connect wallet:', error);
        }
      }
    };

    checkMetaMask();
    loadCampaigns();
  }, [contract]);

  const loadCampaigns = async () => {
    try {
      if (!contract) return;

      const campaignCount = await contract.campaignCount();
      const loadedCampaigns = [];

      for (let i = 1; i <= campaignCount; i++) {
        const campaign = await contract.getCampaign(i);
        if (campaign.isActive) {
          loadedCampaigns.push({
            id: i,
            name: campaign.name,
            description: campaign.description,
            goal: ethers.utils.formatEther(campaign.goal),
            raised: ethers.utils.formatEther(campaign.raised),
            deadline: new Date(campaign.deadline.toNumber() * 1000),
            isActive: campaign.isActive
          });
        }
      }

      setCampaigns(loadedCampaigns);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    campaignId: Yup.number()
      .required('Campaign selection is required')
      .min(1, 'Please select a campaign'),
    amount: Yup.number()
      .required('Donation amount is required')
      .min(0.0001, 'Minimum donation is 0.0001 GO'),
    message: Yup.string()
      .required('Message is required')
      .min(3, 'Message must be at least 3 characters')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (!isMetaMaskInstalled) {
        throw new Error('Please install MetaMask to make donations');
      }

      if (!account) {
        await connectWallet();
        if (!account) {
          throw new Error('Please connect your wallet first');
        }
      }

      if (!contract) {
        throw new Error('Smart contract not initialized');
      }

      // Show pending toast
      const pendingToast = toast.loading('Processing donation...');

      // Convert amount to wei
      const amountInWei = ethers.utils.parseEther(values.amount.toString());

      // Make donation transaction
      const tx = await contract.makeDonation(
        values.campaignId,
        values.message,
        {
          value: amountInWei,
          gasLimit: 300000
        }
      );

      // Update toast to show transaction pending
      toast.update(pendingToast, {
        render: 'Transaction pending...',
        type: 'info',
        isLoading: true
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      // Update toast to show success
      toast.update(pendingToast, {
        render: 'Donation successful!',
        type: 'success',
        isLoading: false,
        autoClose: 5000
      });

      // Reset form and reload campaigns
      resetForm();
      loadCampaigns();

      // Log donation event
      const donationEvent = receipt.events?.find(
        (event) => event.event === 'DonationMade'
      );

      if (donationEvent) {
        const [partyId, donor, amount] = donationEvent.args;
        console.log('Donation made:', {
          partyId: partyId.toString(),
          donor,
          amount: ethers.utils.formatEther(amount)
        });
      }
    } catch (error) {
      console.error('Donation error:', error);
      toast.error(error.message || 'Failed to process donation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2">Loading campaigns...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1c1c24] flex justify-center items-start flex-col rounded-[10px] sm:p-10 p-4">
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h2 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Make a Donation</h2>
      </div>

      {!isMetaMaskInstalled && (
        <div className="mt-[20px] w-full bg-[#3a3a43] p-4 rounded-[10px] border-l-4 border-[#ed3f3f]">
          <p className="font-epilogue text-[14px] text-[#ed3f3f]">
            Please install MetaMask to make donations
          </p>
        </div>
      )}

      {web3Error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700">{web3Error}</p>
        </div>
      )}

      {!account && isMetaMaskInstalled && (
        <button
          onClick={connectWallet}
          className="mt-[20px] font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#8c6dfd] hover:bg-[#7c5dfd] transition-all w-full"
        >
          Connect Wallet
        </button>
      )}

      {campaigns.length === 0 ? (
        <div className="mt-[20px] w-full bg-[#3a3a43] p-4 rounded-[10px]">
          <p className="font-epilogue text-[14px] text-[#808191]">No active campaigns available for donations.</p>
        </div>
      ) : (
        <Formik
          initialValues={{
            campaignId: '',
            amount: '',
            message: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="w-full mt-[65px] flex flex-col gap-[30px]">
              <div>
                <label className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px] block">
                  Select Campaign
                </label>
                <Field
                  as="select"
                  name="campaignId"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-[#1c1c24] font-epilogue text-white text-[14px] rounded-[10px] sm:min-w-[300px] w-full"
                >
                  <option value="">Select a campaign</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name} - Goal: {campaign.goal} GO (Raised: {campaign.raised} GO)
                    </option>
                  ))}
                </Field>
                {errors.campaignId && touched.campaignId && (
                  <p className="mt-1 text-[#ed3f3f] text-[12px] font-epilogue">{errors.campaignId}</p>
                )}
              </div>

              <div>
                <label className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px] block">
                  Donation Amount (GO)
                </label>
                <Field
                  type="number"
                  name="amount"
                  step="0.0001"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] w-full"
                  placeholder="Enter donation amount"
                />
                {errors.amount && touched.amount && (
                  <p className="mt-1 text-[#ed3f3f] text-[12px] font-epilogue">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px] block">
                  Message
                </label>
                <Field
                  as="textarea"
                  name="message"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] w-full min-h-[100px]"
                  placeholder="Enter your message"
                />
                {errors.message && touched.message && (
                  <p className="mt-1 text-[#ed3f3f] text-[12px] font-epilogue">{errors.message}</p>
                )}
              </div>

              <div className="flex justify-center items-center mt-[30px]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#1dc071] hover:bg-[#0bb15e] transition-all w-full ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Processing...' : 'Make Donation'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default DonationForm; 