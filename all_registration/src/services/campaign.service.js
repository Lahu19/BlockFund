import axios from 'axios';
import { ethers } from 'ethers';
import { getContract } from '../utils/web3';
import { auth } from '../config/firebase';

const API_URL = 'http://localhost:5000/api/campaigns';

// Create campaign service
const campaignService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add the token
campaignService.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error('No user is currently signed in');
      throw new Error('User not authenticated');
    }

    const token = await user.getIdToken(/* forceRefresh */ true);
    if (!token) {
      console.error('Failed to get ID token');
      throw new Error('Failed to get authentication token');
    }

    console.log('Adding token to request:', token.substring(0, 10) + '...');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  } catch (error) {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor to handle auth errors
campaignService.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication error:', error.response.data);
      // You might want to redirect to login page or refresh token here
    }
    return Promise.reject(error);
  }
);

export const createCampaign = async (campaignData) => {
  try {
    console.log('Creating campaign on blockchain:', campaignData);
    
    // Get contract instance
    const contract = await getContract();
    
    // Create campaign on blockchain
    const transaction = await contract.createCampaign(
      campaignData.title,
      campaignData.description,
      ethers.utils.parseEther(campaignData.target.toString()),
      new Date(campaignData.deadline).getTime() / 1000, // Convert to seconds
      campaignData.image
    );

    // Wait for transaction to be mined
    const receipt = await transaction.wait();
    console.log('Campaign created on blockchain:', receipt);

    // Prepare data for MongoDB
    const mongoData = {
      ...campaignData,
      owner: await contract.signer.getAddress(),
      contractAddress: contract.address,
      transactionHash: receipt.transactionHash
    };

    // Save campaign to MongoDB
    console.log('Saving campaign to MongoDB:', mongoData);
    const response = await campaignService.post('/', mongoData);
    console.log('Campaign saved to MongoDB:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error creating campaign:', error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(error.message || 'Error creating campaign');
  }
};

export const getAllCampaigns = async () => {
  try {
    const response = await campaignService.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error.response?.data?.error || 'Error fetching campaigns';
  }
};

export const getCampaignById = async (id) => {
  try {
    const response = await campaignService.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    throw error.response?.data?.error || 'Error fetching campaign';
  }
};

export const donateToCampaign = async (campaignId, amount) => {
  try {
    const contract = await getContract();
    const transaction = await contract.donate(campaignId, {
      value: ethers.utils.parseEther(amount.toString())
    });
    const receipt = await transaction.wait();
    return receipt;
  } catch (error) {
    console.error('Error donating to campaign:', error);
    throw error;
  }
}; 