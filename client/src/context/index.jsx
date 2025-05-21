import React, { useContext, createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

// Import your contract ABI
import CrowdFunding from "../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Network Configuration
  const NETWORK_CONFIG = {
    chainId: '0x7A69', // Hardhat's default chain ID
    chainName: 'Localhost Network',
    nativeCurrency: {
      name: 'GO',
      symbol: 'GO',
      decimals: 18
    },
    rpcUrls: ['http://127.0.0.1:8545']
  };

  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  // Check if wallet is already connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setIsWalletConnected(true);
            setAddress(accounts[0]);
            await initializeEthereum();
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };
    
    checkWalletConnection();
  }, []);

  // Initialize provider and contract
  const initializeEthereum = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        // Get network/chain ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        // If not on localhost network, try to switch
        if (chainId !== NETWORK_CONFIG.chainId) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: NETWORK_CONFIG.chainId }]
            });
          } catch (switchError) {
            // If network doesn't exist, add it
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [NETWORK_CONFIG]
                });
              } catch (error) {
                toast.error('Failed to add network to MetaMask');
                return false;
              }
            } else {
              toast.error('Failed to switch network');
              return false;
            }
          }
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        const signer = provider.getSigner();
        setSigner(signer);

        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CrowdFunding.abi,
          signer
        );
        setContract(contract);

        return true;
      } else {
        toast.error('Please install MetaMask');
        return false;
      }
    } catch (error) {
      console.error('Error initializing ethereum:', error);
      toast.error('Failed to initialize blockchain connection');
      return false;
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        setAddress(accounts[0]);
        setIsWalletConnected(true);
        
        const initialized = await initializeEthereum();
        if (initialized) {
          toast.success('Wallet connected successfully!');
        }
      } else {
        toast.error('Please install MetaMask');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new campaign
  const createCampaign = async (form) => {
    try {
      setIsLoading(true);
      
      const data = await contract.createCampaign(
        form.title,
        form.description,
        ethers.utils.parseEther(form.target),
        new Date(form.deadline).getTime(),
        form.image
      );

      await data.wait();
      toast.success('Campaign created successfully!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
    } finally {
      setIsLoading(false);
    }
  };

  // Get all campaigns
  const getCampaigns = async () => {
    try {
      setIsLoading(true);
      const campaigns = await contract.getCampaigns();
      
      const parsedCampaigns = campaigns.map((campaign, i) => ({
        id: i,
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
        image: campaign.image,
        donators: campaign.donators,
        donations: campaign.donations
      }));

      return parsedCampaigns;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Failed to fetch campaigns');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Donate to a campaign
  const donate = async (id, amount) => {
    try {
      setIsLoading(true);
      
      const data = await contract.donateToCampaign(id, {
        value: ethers.utils.parseEther(amount)
      });

      await data.wait();
      toast.success('Donation successful!');
    } catch (error) {
      console.error('Error making donation:', error);
      toast.error('Failed to make donation');
    } finally {
      setIsLoading(false);
    }
  };

  // Get donations of a campaign
  const getDonations = async (id) => {
    try {
      setIsLoading(true);
      const donations = await contract.getCampaign(id);
      
      const numberOfDonations = donations[7].length;
      const parsedDonations = [];

      for (let i = 0; i < numberOfDonations; i++) {
        parsedDonations.push({
          donator: donations[7][i],
          donation: ethers.utils.formatEther(donations[8][i].toString())
        });
      }

      return parsedDonations;
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Failed to fetch donations');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for wallet events
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsWalletConnected(true);
          initializeEthereum();
        } else {
          setAddress('');
          setIsWalletConnected(false);
          setContract(null);
          setSigner(null);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  return (
    <StateContext.Provider value={{
      address,
      contract,
      connectWallet,
      createCampaign,
      getCampaigns,
      donate,
      getDonations,
      isLoading,
      isWalletConnected
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);