import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../constants';

let provider = null;
let signer = null;
let contract = null;

export const initializeWeb3 = async () => {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error('Please install MetaMask to use this application');
    }

    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Create provider and signer
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    // Create contract instance
    contract = new ethers.Contract(contractAddress, contractABI, signer);

    return {
      provider,
      signer,
      contract
    };
  } catch (error) {
    console.error('Error initializing Web3:', error);
    throw error;
  }
};

export const getContract = async () => {
  if (!contract) {
    await initializeWeb3();
  }
  return contract;
};

export const getSigner = async () => {
  if (!signer) {
    await initializeWeb3();
  }
  return signer;
};

export const getProvider = async () => {
  if (!provider) {
    await initializeWeb3();
  }
  return provider;
}; 