import React, { useState, useEffect } from 'react';
import { useWeb3Contract } from '../hooks/useWeb3Contract';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { PoliticalPartiesList } from '../components/Lists';

const PoliticalParties = () => {
  const { contract, account, error: web3Error, connectWallet } = useWeb3Contract();
  const [isAdmin, setIsAdmin] = useState(false);
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
        gasLimit: 200000
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
        <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px] max-w-[480px] mx-auto w-full">
          <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white text-center">Political Parties</h1>
        </div>
        <button
          onClick={connectWallet}
          className="mt-[20px] font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#8c6dfd] hover:bg-[#7c5dfd] transition-all w-full"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#1c1c24] flex justify-center items-start flex-col rounded-[10px] sm:p-10 p-4">
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px] max-w-[480px] mx-auto w-full">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white text-center">Political Parties</h1>
      </div>

      <div className="w-full mt-[65px]">
        <PoliticalPartiesList
          parties={registeredParties}
          isAdmin={isAdmin}
          onToggleStatus={togglePartyStatus}
          isLoading={isLoadingParties}
        />
      </div>
    </div>
  );
};

export default PoliticalParties; 