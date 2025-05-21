import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CustomButton, FormField, Loader } from '../components';
import { registerParty } from '../services/party.service';

const RegisterParty = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    partyName: '',
    leaderName: '',
    registrationNumber: '',
    leaderAddress: ''
  });

  const validateForm = () => {
    if (!form.partyName.trim()) {
      toast.error('Party name is required');
      return false;
    }
    if (!form.leaderName.trim()) {
      toast.error('Leader name is required');
      return false;
    }
    if (!form.registrationNumber.trim()) {
      toast.error('Registration number is required');
      return false;
    }
    if (!form.leaderAddress.trim()) {
      toast.error('Leader ethereum address is required');
      return false;
    }

    return true;
  };

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // First validate the form
      if (!validateForm()) {
        return;
      }

      setIsLoading(true);

      // Format the data to match the server's expected format
      const formattedData = {
        partyName: form.partyName.trim(),
        leaderName: form.leaderName.trim(),
        registrationNumber: form.registrationNumber.trim(),
        leaderAddress: form.leaderAddress.trim()
      };

      console.log('Submitting party data:', formattedData);

      const response = await registerParty(formattedData);
      
      console.log('Server response:', response);

      if (response.success) {
        toast.success('Party registered successfully!');
        navigate('/dashboard');
      } else {
        throw new Error(response.error || 'Failed to register party');
      }
    } catch (error) {
      console.error('Error registering party:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with an error
        const errorMessage = error.response.data?.error || 'Server error occurred';
        toast.error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        toast.error('No response from server. Please check your connection.');
      } else {
        // Something else went wrong
        toast.error(error.message || 'Error registering party');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Register Political Party</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Party Name *"
            placeholder="Enter party name"
            inputType="text"
            value={form.partyName}
            handleChange={(e) => handleFormFieldChange('partyName', e)}
          />
          <FormField 
            labelName="Leader Name *"
            placeholder="Enter party leader name"
            inputType="text"
            value={form.leaderName}
            handleChange={(e) => handleFormFieldChange('leaderName', e)}
          />
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Registration Number *"
            placeholder="Enter registration number"
            inputType="text"
            value={form.registrationNumber}
            handleChange={(e) => handleFormFieldChange('registrationNumber', e)}
          />
          <FormField 
            labelName="Leader's Ethereum Address *"
            placeholder="Enter leader's Ethereum address"
            inputType="text"
            value={form.leaderAddress}
            handleChange={(e) => handleFormFieldChange('leaderAddress', e)}
          />
        </div>

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton 
            btnType="submit"
            title="Register Party"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>

      <div className="mt-[30px] text-[#808191] text-center">
        <p>All fields marked with * are required</p>
      </div>
    </div>
  );
};

export default RegisterParty; 