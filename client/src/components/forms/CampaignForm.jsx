import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useWeb3Contract } from '../../hooks/useWeb3Contract';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

const CampaignForm = () => {
  const { contract, account, error: web3Error, connectWallet, provider } = useWeb3Contract();
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [availableParties, setAvailableParties] = useState([]);
  const [isLoadingParties, setIsLoadingParties] = useState(true);

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
  }, []);

  useEffect(() => {
    const loadParties = async () => {
      if (contract) {
        try {
          setIsLoadingParties(true);
          const partyCount = await contract.partyCount();
          const parties = [];

          for (let i = 1; i <= partyCount.toNumber(); i++) {
            try {
              const party = await contract.getParty(i);
              if (party.isActive) {
                parties.push({
                  id: i,
                  name: party.name,
                  leader: party.leader,
                  isActive: party.isActive
                });
              }
            } catch (error) {
              console.error(`Error loading party ${i}:`, error);
            }
          }

          setAvailableParties(parties);
        } catch (error) {
          console.error('Error loading parties:', error);
          toast.error('Failed to load political parties');
        } finally {
          setIsLoadingParties(false);
        }
      }
    };

    loadParties();
  }, [contract]);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Campaign name is required')
      .min(3, 'Name must be at least 3 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
    goal: Yup.number()
      .required('Funding goal is required')
      .min(0.0001, 'Goal must be at least 0.0001 GO'),
    duration: Yup.number()
      .required('Duration is required')
      .min(1, 'Duration must be at least 1 day')
      .max(365, 'Duration cannot exceed 365 days'),
    partyId: Yup.number()
      .required('Party ID is required')
      .test('party-exists', 'Selected party does not exist or is not active', 
        function(value) {
          return availableParties.some(party => party.id === Number(value) && party.isActive);
        }
      ),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmissionError(null);
      setSubmissionSuccess(false);
      setTransactionHash(null);

      if (!isMetaMaskInstalled) {
        throw new Error('Please install MetaMask to create a campaign');
      }

      if (!account) {
        await connectWallet();
        if (!account) {
          throw new Error('Please connect your wallet first');
        }
      }

      if (!contract) {
        throw new Error('Smart contract not initialized. Please check your network connection.');
      }

      // Verify party is active before proceeding
      const selectedParty = availableParties.find(party => party.id === Number(values.partyId));
      if (!selectedParty) {
        throw new Error('Selected party does not exist or is not active');
      }

      // Show pending toast
      const pendingToast = toast.loading('Creating campaign...');

      // Convert goal to wei
      const goalInWei = ethers.utils.parseEther(values.goal.toString());

      console.log('Creating campaign with params:', {
        name: values.name,
        description: values.description,
        goalInWei: goalInWei.toString(),
        duration: values.duration,
        partyId: Number(values.partyId)
      });

      // Get current gas price
      const gasPrice = await provider.getGasPrice();
      console.log('Current gas price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');

      // Create campaign transaction
      const tx = await contract.createCampaign(
        values.name,
        values.description,
        goalInWei,
        values.duration,
        Number(values.partyId),
        {
          gasPrice: gasPrice,
          gasLimit: 500000 // Set a reasonable gas limit
        }
      );

      setTransactionHash(tx.hash);
      console.log('Transaction hash:', tx.hash);

      // Update toast to show transaction pending
      toast.update(pendingToast, {
        render: `Transaction pending... Hash: ${tx.hash.slice(0, 10)}...`,
        type: 'info',
        isLoading: true
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);

      // Update toast to show success
      toast.update(pendingToast, {
        render: 'Campaign created successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 5000
      });

      setSubmissionSuccess(true);
      resetForm();

    } catch (error) {
      console.error('Campaign creation error:', error);
      const errorMessage = error.message || 'Failed to create campaign';
      setSubmissionError(errorMessage);
      
      toast.error(
        <div>
          <p>Failed to create campaign</p>
          <p className="text-sm mt-1">{errorMessage}</p>
          {transactionHash && (
            <p className="text-sm mt-1">TX Hash: {transactionHash.slice(0, 10)}...</p>
          )}
        </div>,
        {
          position: "top-right",
          autoClose: 5000
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-epilogue bg-[#1c1c24] rounded-[10px] p-8 w-full max-w-[1080px] mx-auto">
      <h2 className="text-white font-semibold text-[18px] mb-8 text-center">Create Campaign</h2>
      
      {!isMetaMaskInstalled && (
        <div className="bg-[#3a3a43] border-l-4 border-yellow-500 p-4 mb-6 rounded-[10px]">
          <p className="text-white">
            Please install MetaMask to create campaigns.{' '}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1dc071] hover:opacity-80 transition-opacity"
            >
              Download MetaMask
            </a>
          </p>
        </div>
      )}

      {web3Error && (
        <div className="bg-[#3a3a43] border-l-4 border-[#ed3f3f] p-4 mb-6 rounded-[10px]">
          <p className="text-[#ed3f3f]">{web3Error}</p>
        </div>
      )}

      {submissionError && (
        <div className="bg-[#3a3a43] border-l-4 border-[#ed3f3f] p-4 mb-6 rounded-[10px]">
          <p className="text-[#ed3f3f]">{submissionError}</p>
        </div>
      )}

      {submissionSuccess && (
        <div className="bg-[#3a3a43] border-l-4 border-[#1dc071] p-4 mb-6 rounded-[10px]">
          <p className="text-[#1dc071]">Campaign created successfully!</p>
        </div>
      )}

      <Formik
        initialValues={{
          name: '',
          description: '',
          goal: '',
          duration: 30,
          partyId: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-[14px] font-medium text-white mb-2">
                Campaign Name
              </label>
              <Field
                type="text"
                name="name"
                className={`mt-1 block w-full bg-transparent border rounded-[10px] py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1dc071] ${
                  errors.name && touched.name ? 'border-[#ed3f3f]' : 'border-[#3a3a43]'
                }`}
              />
              {errors.name && touched.name && (
                <p className="mt-2 text-[12px] text-[#ed3f3f]">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-[14px] font-medium text-white mb-2">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                rows={4}
                className={`mt-1 block w-full bg-transparent border rounded-[10px] py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1dc071] ${
                  errors.description && touched.description ? 'border-[#ed3f3f]' : 'border-[#3a3a43]'
                }`}
              />
              {errors.description && touched.description && (
                <p className="mt-2 text-[12px] text-[#ed3f3f]">{errors.description}</p>
              )}
            </div>

            <div>
              <label htmlFor="goal" className="block text-[14px] font-medium text-white mb-2">
                Funding Goal (GO)
              </label>
              <Field
                type="number"
                name="goal"
                step="0.0001"
                className={`mt-1 block w-full bg-transparent border rounded-[10px] py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1dc071] ${
                  errors.goal && touched.goal ? 'border-[#ed3f3f]' : 'border-[#3a3a43]'
                }`}
              />
              {errors.goal && touched.goal && (
                <p className="mt-2 text-[12px] text-[#ed3f3f]">{errors.goal}</p>
              )}
            </div>

            <div>
              <label htmlFor="duration" className="block text-[14px] font-medium text-white mb-2">
                Duration (days)
              </label>
              <Field
                type="number"
                name="duration"
                min="1"
                max="365"
                className={`mt-1 block w-full bg-transparent border rounded-[10px] py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1dc071] ${
                  errors.duration && touched.duration ? 'border-[#ed3f3f]' : 'border-[#3a3a43]'
                }`}
              />
              {errors.duration && touched.duration && (
                <p className="mt-2 text-[12px] text-[#ed3f3f]">{errors.duration}</p>
              )}
            </div>

            <div>
              <label htmlFor="partyId" className="block text-[14px] font-medium text-white mb-2">
                Political Party
              </label>
              {isLoadingParties ? (
                <div className="mt-1 text-[14px] text-gray-400">Loading parties...</div>
              ) : availableParties.length === 0 ? (
                <div className="mt-1 text-[14px] text-[#ed3f3f]">No active political parties found</div>
              ) : (
                <Field
                  as="select"
                  name="partyId"
                  className={`mt-1 block w-full bg-transparent border rounded-[10px] py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#1dc071] ${
                    errors.partyId && touched.partyId ? 'border-[#ed3f3f]' : 'border-[#3a3a43]'
                  }`}
                >
                  <option value="" className="bg-[#1c1c24] text-white">Select a party</option>
                  {availableParties.map(party => (
                    <option key={party.id} value={party.id.toString()} className="bg-[#1c1c24] text-white">
                      {party.name} - Led by {party.leader} (ID: {party.id})
                    </option>
                  ))}
                </Field>
              )}
              {errors.partyId && touched.partyId && (
                <p className="mt-2 text-[12px] text-[#ed3f3f]">{errors.partyId}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || !account || !isMetaMaskInstalled || isLoadingParties || availableParties.length === 0}
                className={`w-full flex justify-center py-4 px-6 rounded-[10px] text-[16px] font-semibold text-white transition-all ${
                  (isSubmitting || !account || !isMetaMaskInstalled || isLoadingParties || availableParties.length === 0)
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-[#1dc071] hover:bg-[#1ab067] active:bg-[#18a05e]'
                }`}
              >
                {isSubmitting ? 'Creating Campaign...' : 'Create Campaign'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CampaignForm; 