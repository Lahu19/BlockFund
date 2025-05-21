import React from 'react';
import { DonationForm } from '../components/forms';
import { useStateContext } from '../context';

const Donations = () => {
  const { address } = useStateContext();

  return (
    <div className="bg-[#1c1c24] flex justify-center items-start flex-col rounded-[10px] sm:p-10 p-4">
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px] max-w-[480px] mx-auto w-full">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white text-center">Make a Donation</h1>
      </div>

      <div className="w-full mt-[65px] flex flex-col gap-[30px]">
        <DonationForm />
      </div>
    </div>
  );
};

export default Donations; 