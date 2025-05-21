import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PoliticalPartyFund from '../artifacts/contracts/PoliticalPartyFund.sol/PoliticalPartyFund.json';
import { contractAddresses } from '../config';

export const useContract = () => {
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      try {
        if (typeof window.ethereum === 'undefined') {
          throw new Error('Please install MetaMask to use this application');
        }

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contractAddress = contractAddresses.PoliticalPartyFund;
        if (!contractAddress) {
          throw new Error('Contract address not found');
        }

        const politicalPartyFund = new ethers.Contract(
          contractAddress,
          PoliticalPartyFund.abi,
          signer
        );

        setContract(politicalPartyFund);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Contract initialization error:', err);
        setError(err.message);
        setContract(null);
      }
    };

    initContract();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        initContract();
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', initContract);
        window.ethereum.removeListener('chainChanged', () => {
          window.location.reload();
        });
      }
    };
  }, []);

  return { contract, error };
}; 