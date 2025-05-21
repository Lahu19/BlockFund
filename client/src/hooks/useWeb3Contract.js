import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PoliticalPartyFund from '../../../web3/artifacts/contracts/PoliticalPartyFund.sol/PoliticalPartyFund.json';

// Contract configuration
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Default local hardhat address

// GoChain network configuration
const networkConfig = {
  chainId: import.meta.env.VITE_NETWORK_ID || '31337',
  chainName: 'GoChain Testnet',
  rpcUrls: [import.meta.env.VITE_NETWORK_RPC_URL || 'http://127.0.0.1:8545'],
  nativeCurrency: {
    name: 'GO',
    symbol: 'GO',
    decimals: 18
  }
};

export const useWeb3Contract = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [provider, setProvider] = useState(null);

  const testRpcConnection = async (rpcUrl) => {
    try {
      const tempProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
      await tempProvider.getBlockNumber();
      return true;
    } catch (error) {
      console.error('RPC Connection test failed:', error);
      return false;
    }
  };

  const setupNetwork = async () => {
    try {
      // Test RPC connection before adding to MetaMask
      const isRpcWorking = await testRpcConnection(networkConfig.rpcUrls[0]);
      if (!isRpcWorking) {
        throw new Error('Cannot connect to GoChain RPC. Please check if your blockchain is running.');
      }

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          ...networkConfig,
          blockExplorerUrls: ['']
        }],
      });
      return true;
    } catch (error) {
      console.error('Error setting up network:', error);
      setError(error.message || 'Failed to setup GoChain Testnet. Please check your blockchain connection.');
      return false;
    }
  };

  const checkNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const isCorrect = chainId === `0x${parseInt(networkConfig.chainId).toString(16)}`;
      setIsCorrectNetwork(isCorrect);
      return isCorrect;
    } catch (error) {
      console.error('Error checking network:', error);
      setError('Failed to check network. Please ensure your blockchain is running.');
      return false;
    }
  };

  const initializeProvider = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        // Test the connection
        await web3Provider.getBlockNumber();
        setProvider(web3Provider);
        return web3Provider;
      }
      throw new Error('MetaMask not found');
    } catch (error) {
      console.error('Provider initialization error:', error);
      setError('Failed to connect to blockchain. Please check if your blockchain is running.');
      return null;
    }
  };

  const initializeContract = async (signer) => {
    try {
      if (!contractAddress) {
        throw new Error('Contract address not configured');
      }

      console.log('Initializing contract with address:', contractAddress);
      const contractInstance = new ethers.Contract(
        contractAddress,
        PoliticalPartyFund.abi,
        signer
      );

      // Test contract connection
      await contractInstance.campaignCount();
      return contractInstance;
    } catch (error) {
      console.error('Contract initialization error:', error);
      throw new Error('Failed to initialize contract. Please check the contract address and network connection.');
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          // Initialize provider first
          const web3Provider = await initializeProvider();
          if (!web3Provider) return;

          // Check network
          const correctNetwork = await checkNetwork();
          if (!correctNetwork) {
            const success = await setupNetwork();
            if (!success) return;
          }

          // Request account access
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);

          // Create contract instance
          const signer = web3Provider.getSigner();
          const contractInstance = await initializeContract(signer);
          setContract(contractInstance);

          // Event listeners
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
          });

          window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
          });
        } else {
          setError('Please install MetaMask to use this application');
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setError(err.message || 'Failed to initialize. Please check your blockchain connection.');
      }
    };

    init();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        // Initialize provider first
        const web3Provider = await initializeProvider();
        if (!web3Provider) return;

        // Check network
        const correctNetwork = await checkNetwork();
        if (!correctNetwork) {
          const success = await setupNetwork();
          if (!success) return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        // Initialize contract after wallet connection
        if (web3Provider) {
          const signer = web3Provider.getSigner();
          const contractInstance = await initializeContract(signer);
          setContract(contractInstance);
        }
      } else {
        setError('Please install MetaMask to use this application');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet. Please check your blockchain connection.');
    }
  };

  return {
    contract,
    account,
    error,
    connectWallet,
    isCorrectNetwork,
    provider
  };
};

export default useWeb3Contract; 