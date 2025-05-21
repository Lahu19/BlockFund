import React from 'react';

const CampaignList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-[#1c1c24] p-4 rounded-[10px] shadow-secondary">
        <p className="text-[#808191] font-epilogue">No campaigns found</p>
      </div>
    </div>
  );
};

export default CampaignList;
