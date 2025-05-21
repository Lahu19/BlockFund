import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create party service
const partyService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const registerParty = async (partyData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/parties/register`, partyData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error registering party:', error);
    throw error;
  }
};

export const getParties = async () => {
  try {
    const response = await axios.get(`${API_URL}/parties`);
    return response.data;
  } catch (error) {
    console.error('Error fetching parties:', error);
    throw error;
  }
};

export const getPartyById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/parties/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching party:', error);
    throw error;
  }
};

export const updateParty = async (id, partyData) => {
  try {
    const response = await partyService.put(`/${id}`, partyData);
    return response.data;
  } catch (error) {
    console.error('Error updating party:', error);
    throw error.response?.data?.error || 'Error updating party';
  }
};

export const deleteParty = async (id) => {
  try {
    const response = await partyService.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting party:', error);
    throw error.response?.data?.error || 'Error deleting party';
  }
}; 