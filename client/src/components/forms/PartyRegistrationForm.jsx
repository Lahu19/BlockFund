import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useWeb3Contract } from '../../hooks/useWeb3Contract';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

const PartyRegistrationForm = () => {
  const { contract, account, error: web3Error, connectWallet } = useWeb3Contract();
  const [isAdmin, setIsAdmin] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [registeredParties, setRegisteredParties] = useState([]);
  const [isLoadingParties, setIsLoadingParties] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (contract && account) {
        try {
          const adminAddress = await contract.admin();
          setIsAdmin(adminAddress.toLowerCase() === account.toLowerCase());
        } catch (error) {
          console.error('Failed to check admin status:', error);
          setIsAdmin(false);
        }
      }
    };

    checkAdminStatus();
  }, [contract, account]);

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
              parties.push({
                id: i,
                name: party.name,
                leader: party.leader,
                registrationNumber: party.registrationNumber,
                leaderAddress: party.leaderAddress,
                isActive: party.isActive,
                totalDonations: ethers.utils.formatEther(party.totalDonations)
              });
            } catch (error) {
              console.error(`Error loading party ${i}:`, error);
            }
          }

          setRegisteredParties(parties);
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
      .required('Party name is required')
      .min(3, 'Name must be at least 3 characters'),
    leader: Yup.string()
      .required('Party leader name is required')
      .min(2, 'Leader name must be at least 2 characters'),
    registrationNumber: Yup.string()
      .required('Registration number is required')
      .min(3, 'Registration number must be at least 3 characters'),
    leaderAddress: Yup.string()
      .required('Leader wallet address is required')
      .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmissionError(null);
      setSubmissionSuccess(false);

      if (!contract) {
        throw new Error('Smart contract not initialized');
      }

      if (!isAdmin) {
        throw new Error('Only administrators can register parties');
      }

      // Check if party with same registration number exists
      const existingParty = registeredParties.find(
        party => party.registrationNumber === values.registrationNumber
      );
      if (existingParty) {
        throw new Error('A party with this registration number already exists');
      }

      // Show pending toast
      const pendingToast = toast.loading('Registering political party...');

      // Register the party
      const tx = await contract.registerParty(
        values.name,
        values.leader,
        values.registrationNumber,
        values.leaderAddress,
        {
          gasLimit: 300000 // Set a reasonable gas limit
        }
      );

      // Update toast to show transaction pending
      toast.update(pendingToast, {
        render: `Transaction pending... Hash: ${tx.hash.slice(0, 10)}...`,
        type: 'info',
        isLoading: true
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      // Get the party ID from the event
      const partyRegisteredEvent = receipt.events?.find(
        event => event.event === 'PartyRegistered'
      );

      if (partyRegisteredEvent) {
        const [partyId, name, leader] = partyRegisteredEvent.args;
        console.log('Party registered:', { partyId: partyId.toString(), name, leader });
      }

      // Update toast to show success
      toast.update(pendingToast, {
        render: 'Political party registered successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 5000
      });

      setSubmissionSuccess(true);
      resetForm();

      // Reload parties list
      const loadParties = async () => {
        if (contract) {
          try {
            setIsLoadingParties(true);
            const partyCount = await contract.partyCount();
            const parties = [];

            for (let i = 1; i <= partyCount.toNumber(); i++) {
              try {
                const party = await contract.getParty(i);
                parties.push({
                  id: i,
                  name: party.name,
                  leader: party.leader,
                  registrationNumber: party.registrationNumber,
                  leaderAddress: party.leaderAddress,
                  isActive: party.isActive,
                  totalDonations: ethers.utils.formatEther(party.totalDonations)
                });
              } catch (error) {
                console.error(`Error loading party ${i}:`, error);
              }
            }

            setRegisteredParties(parties);
          } catch (error) {
            console.error('Error loading parties:', error);
          } finally {
            setIsLoadingParties(false);
          }
        }
      };

      loadParties();
    } catch (error) {
      console.error('Party registration error:', error);
      const errorMessage = error.message || 'Failed to register party';
      setSubmissionError(errorMessage);
      
      toast.error(
        <div>
          <p>Failed to register party</p>
          <p className="text-sm mt-1">{errorMessage}</p>
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

  const togglePartyStatus = async (partyId, currentStatus) => {
    try {
      if (!contract) {
        throw new Error('Smart contract not initialized');
      }

      if (!isAdmin) {
        throw new Error('Only administrators can modify party status');
      }

      // Show pending toast
      const pendingToast = toast.loading(`${currentStatus ? 'Deactivating' : 'Activating'} party...`);

      // Call the togglePartyStatus function
      const tx = await contract.togglePartyStatus(partyId, {
        gasLimit: 200000 // Set a reasonable gas limit
      });

      // Update toast to show transaction pending
      toast.update(pendingToast, {
        render: `Transaction pending... Hash: ${tx.hash.slice(0, 10)}...`,
        type: 'info',
        isLoading: true
      });

      // Wait for transaction confirmation
      await tx.wait();

      // Update toast to show success
      toast.update(pendingToast, {
        render: `Party ${currentStatus ? 'deactivated' : 'activated'} successfully!`,
        type: 'success',
        isLoading: false,
        autoClose: 5000
      });

      // Reload parties list
      const loadParties = async () => {
        if (contract) {
          try {
            setIsLoadingParties(true);
            const partyCount = await contract.partyCount();
            const parties = [];

            for (let i = 1; i <= partyCount.toNumber(); i++) {
              try {
                const party = await contract.getParty(i);
                parties.push({
                  id: i,
                  name: party.name,
                  leader: party.leader,
                  registrationNumber: party.registrationNumber,
                  leaderAddress: party.leaderAddress,
                  isActive: party.isActive,
                  totalDonations: ethers.utils.formatEther(party.totalDonations)
                });
              } catch (error) {
                console.error(`Error loading party ${i}:`, error);
              }
            }

            setRegisteredParties(parties);
          } catch (error) {
            console.error('Error loading parties:', error);
          } finally {
            setIsLoadingParties(false);
          }
        }
      };

      loadParties();
    } catch (error) {
      console.error('Party status update error:', error);
      const errorMessage = error.message || 'Failed to update party status';
      
      toast.error(
        <div>
          <p>Failed to update party status</p>
          <p className="text-sm mt-1">{errorMessage}</p>
        </div>,
        {
          position: "top-right",
          autoClose: 5000
        }
      );
    }
  };

  if (!account) {
    return (
      <div className="bg-[#1c1c24] flex justify-center items-start flex-col rounded-[10px] sm:p-10 p-4">
       
        <button
          onClick={connectWallet}
          className="mt-[20px] font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#8c6dfd] hover:bg-[#7c5dfd] transition-all w-full"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="bg-[#1c1c24] flex justify-center items-start flex-col rounded-[10px] sm:p-10 p-4">
        
        <div className="mt-[20px] w-full bg-[#3a3a43] p-4 rounded-[10px]">
          <p className="font-epilogue text-[14px] text-white">
            Only administrators can register political parties.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1c1c24] flex justify-center items-start flex-col rounded-[10px] sm:p-10 p-4">
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px] max-w-[480px] mx-auto w-full">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white text-center">Register Political Party</h1>
      </div>

      {/* Display registered parties */}
      {/* <div className="w-full mt-[65px]">
        <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px] max-w-[480px] mx-auto w-full">
          <h2 className="font-epilogue font-semibold text-[18px] text-white text-center">Registered Parties</h2>
        </div>
        
        {isLoadingParties ? (
          <div className="bg-[#3a3a43] rounded-[10px] p-4">
            <p className="font-epilogue text-[14px] text-[#808191]">Loading parties...</p>
          </div>
        ) : registeredParties.length === 0 ? (
          <div className="bg-[#3a3a43] rounded-[10px] p-4">
            <p className="font-epilogue text-[14px] text-[#808191]">No parties registered yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
            {registeredParties.map((party) => (
              <div key={party.id} className="bg-[#1c1c24] rounded-[15px] p-4 border border-[#3a3a43]">
                <h4 className="font-epilogue font-semibold text-[16px] text-white mb-2">{party.name}</h4>
                <div className="space-y-2">
                  <p className="font-epilogue text-[14px] text-[#808191]">
                    Leader: <span className="text-white">{party.leader}</span>
                  </p>
                  <p className="font-epilogue text-[14px] text-[#808191]">
                    Registration: <span className="text-white">{party.registrationNumber}</span>
                  </p>
                  <p className="font-epilogue text-[14px] text-[#808191]">
                    Status: <span className={`text-${party.isActive ? '[#1dc071]' : '[#ed3f3f]'}`}>
                      {party.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                  <p className="font-epilogue text-[14px] text-[#808191]">
                    Total Donations: <span className="text-white">{party.totalDonations} GO</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div> */}

      {/* Registration Form */}
      <div className="w-full mt-[65px]">
        
        
        {web3Error && (
          <div className="bg-[#3a3a43] p-4 rounded-[10px] border-l-4 border-[#ed3f3f] mb-[30px]">
            <p className="font-epilogue text-[14px] text-[#ed3f3f]">{web3Error}</p>
          </div>
        )}

        {submissionError && (
          <div className="bg-[#3a3a43] p-4 rounded-[10px] border-l-4 border-[#ed3f3f] mb-[30px]">
            <p className="font-epilogue text-[14px] text-[#ed3f3f]">{submissionError}</p>
          </div>
        )}

        {submissionSuccess && (
          <div className="bg-[#3a3a43] p-4 rounded-[10px] border-l-4 border-[#1dc071] mb-[30px]">
            <p className="font-epilogue text-[14px] text-[#1dc071]">Party registered successfully!</p>
          </div>
        )}

        <Formik
          initialValues={{
            name: '',
            leader: '',
            registrationNumber: '',
            leaderAddress: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="flex flex-col gap-[30px]">
              <div>
                <label className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px] block">
                  Party Name
                </label>
                <Field
                  type="text"
                  name="name"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] w-full"
                  placeholder="Enter party name"
                />
                {errors.name && touched.name && (
                  <p className="mt-1 text-[#ed3f3f] text-[12px] font-epilogue">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px] block">
                  Party Leader Name
                </label>
                <Field
                  type="text"
                  name="leader"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] w-full"
                  placeholder="Enter leader name"
                />
                {errors.leader && touched.leader && (
                  <p className="mt-1 text-[#ed3f3f] text-[12px] font-epilogue">{errors.leader}</p>
                )}
              </div>

              <div>
                <label className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px] block">
                  Registration Number
                </label>
                <Field
                  type="text"
                  name="registrationNumber"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] w-full"
                  placeholder="Enter registration number"
                />
                {errors.registrationNumber && touched.registrationNumber && (
                  <p className="mt-1 text-[#ed3f3f] text-[12px] font-epilogue">{errors.registrationNumber}</p>
                )}
              </div>

              <div>
                <label className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px] block">
                  Leader Wallet Address
                </label>
                <Field
                  type="text"
                  name="leaderAddress"
                  className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] w-full"
                  placeholder="Enter leader's Ethereum address"
                />
                {errors.leaderAddress && touched.leaderAddress && (
                  <p className="mt-1 text-[#ed3f3f] text-[12px] font-epilogue">{errors.leaderAddress}</p>
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
                  {isSubmitting ? 'Registering Party...' : 'Register Party'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PartyRegistrationForm; 