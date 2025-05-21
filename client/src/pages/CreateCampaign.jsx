import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCampaign = () => {
  const navigate = useNavigate();

  const handleCampaignCreated = () => {
    navigate('/campaigns');
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Create Campaign</h1>
      </div>

      <div className="w-full mt-[65px]">
        <p className="text-white text-center">Campaign form will be implemented soon</p>
      </div>
    </div>
  );
};

export default CreateCampaign;