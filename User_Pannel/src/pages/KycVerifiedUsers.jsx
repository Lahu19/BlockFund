import React, { useState, useEffect } from 'react';
import { useWeb3Contract } from '../hooks/useWeb3Contract';
import { toast } from 'react-toastify';
import { KycVerifiedUsersList } from '../components/Lists';

const KycVerifiedUsers = () => {
  const { contract, account, error: web3Error, connectWallet } = useWeb3Contract();
  const [isAdmin, setIsAdmin] = useState(false);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

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
    const loadVerifiedUsers = async () => {
      if (contract) {
        try {
          setIsLoadingUsers(true);
          
          // Check if we're connected to the right network
          const network = await contract.provider.getNetwork();
          console.log('Connected to network:', network);

          // Check if we have the right permissions
          const adminAddress = await contract.admin();
          const currentAddress = await contract.signer.getAddress();
          console.log('Admin address:', adminAddress);
          console.log('Current address:', currentAddress);
          console.log('Is admin:', adminAddress.toLowerCase() === currentAddress.toLowerCase());

          // Check for registered users through events
          const filter = contract.filters.UserRegistered();
          const events = await contract.queryFilter(filter);
          console.log('UserRegistered events:', events);

          const userCount = await contract.getUserCount();
          console.log('Total user count:', userCount.toNumber());
          const users = [];

          for (let i = 0; i < userCount.toNumber(); i++) {
            try {
              const userAddress = await contract.getUserByIndex(i);
              console.log(`Fetching user ${i} with address:`, userAddress);
              const [fullName, userRole, isKycVerified, isActive] = await contract.getUser(userAddress);
              console.log(`User ${i} data:`, {
                address: userAddress,
                fullName,
                userRole,
                isKycVerified,
                isActive
              });
              
              // Check if the user is KYC verified
              if (isKycVerified) {
                users.push({
                  address: userAddress,
                  fullName,
                  role: userRole,
                  isVerified: isKycVerified,
                  isActive,
                  verificationDate: Date.now() // Since verificationDate is not in the contract, use current time
                });
                console.log(`Added verified user ${i} to list:`, users[users.length - 1]);
              } else {
                console.log(`User ${i} is not KYC verified`);
              }
            } catch (error) {
              console.error(`Error loading user ${i}:`, error);
            }
          }

          console.log('Final verified users list:', users);
          setVerifiedUsers(users);
        } catch (error) {
          console.error('Error loading verified users:', error);
          toast.error('Failed to load KYC verified users');
        } finally {
          setIsLoadingUsers(false);
        }
      }
    };

    loadVerifiedUsers();
  }, [contract]);

  const toggleUserVerification = async (userAddress, currentStatus) => {
    try {
      if (!contract) {
        throw new Error('Smart contract not initialized');
      }

      if (!isAdmin) {
        throw new Error('Only administrators can modify verification status');
      }

      // Show pending toast
      const pendingToast = toast.loading(`${currentStatus ? 'Revoking' : 'Verifying'} user...`);

      // Call the verifyKyc function - note that the contract only supports verification, not revocation
      const tx = await contract.verifyKyc(userAddress, {
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
        render: 'User verified successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 5000
      });

      // Reload users list
      loadVerifiedUsers();
    } catch (error) {
      console.error('User verification update error:', error);
      const errorMessage = error.message || 'Failed to update user verification status';
      
      toast.error(
        <div>
          <p>Failed to update user verification status</p>
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
          <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white text-center">KYC Verified Users</h1>
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
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white text-center">KYC Verified Users</h1>
      </div>

      <div className="w-full mt-[65px]">
        <KycVerifiedUsersList
          users={verifiedUsers}
          isAdmin={isAdmin}
          onToggleStatus={toggleUserVerification}
          isLoading={isLoadingUsers}
        />
      </div>
    </div>
  );
};

export default KycVerifiedUsers; 