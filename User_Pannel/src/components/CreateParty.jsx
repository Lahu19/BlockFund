import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormField from './FormField';
import CustomButton from './CustomButton';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../utils/constants';

const CreateParty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    logo: '',
    manifesto: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.createParty(
        form.name,
        form.description,
        form.logo,
        form.manifesto
      );

      await tx.wait();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating party:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormFieldChange = (fieldName, e) => {
    setForm(prev => ({ ...prev, [fieldName]: e.target.value }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#13131a] p-4">
      <div className="w-full max-w-2xl bg-[#1c1c24] rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Create New Political Party</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            labelName="Party Name *"
            placeholder="Enter party name"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />

          <FormField
            labelName="Description *"
            placeholder="Enter party description"
            inputType="text"
            value={form.description}
            handleChange={(e) => handleFormFieldChange('description', e)}
          />

          <FormField
            labelName="Logo URL"
            placeholder="Enter logo URL"
            inputType="text"
            value={form.logo}
            handleChange={(e) => handleFormFieldChange('logo', e)}
          />

          <FormField
            labelName="Manifesto *"
            placeholder="Enter party manifesto"
            inputType="text"
            value={form.manifesto}
            handleChange={(e) => handleFormFieldChange('manifesto', e)}
          />

          <div className="flex justify-center mt-6">
            <CustomButton
              btnType="submit"
              title={isLoading ? 'Creating...' : 'Create Party'}
              styles="bg-[#8c6dfd]"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateParty; 