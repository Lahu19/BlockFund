import React, { useState } from 'react';
import { useWeb3Contract } from '../../hooks/useWeb3Contract';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const UserRegistrationForm = () => {
  const { contract } = useWeb3Contract();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: '',
      userRole: 'donor', // Default role
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full name is required'),
      userRole: Yup.string()
        .oneOf(['donor', 'politician', 'auditor'], 'Invalid role')
        .required('Role is required'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const tx = await contract.registerUser(
          values.fullName,
          values.userRole
        );
        await tx.wait();
        
        // Save to MongoDB
        await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            walletAddress: window.ethereum.selectedAddress,
            blockchainTxHash: tx.hash,
          }),
        });

        formik.resetForm();
      } catch (error) {
        console.error('Error registering user:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="bg-[#1c1c24] flex justify-center items-start flex-col rounded-[10px] sm:p-10 p-4">
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h2 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Register User</h2>
      </div>

      <form onSubmit={formik.handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div>
          <label className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px] block">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.fullName}
            className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] w-full"
          />
          {formik.touched.fullName && formik.errors.fullName && (
            <div className="mt-1 text-[#ed3f3f] text-[12px] font-epilogue">{formik.errors.fullName}</div>
          )}
        </div>

        <div>
          <label className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px] block">
            Role
          </label>
          <select
            name="userRole"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.userRole}
            className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-[#1c1c24] font-epilogue text-white text-[14px] rounded-[10px] sm:min-w-[300px] w-full"
          >
            <option value="donor">Donor</option>
            <option value="politician">Politician</option>
            <option value="auditor">Auditor</option>
          </select>
          {formik.touched.userRole && formik.errors.userRole && (
            <div className="mt-1 text-[#ed3f3f] text-[12px] font-epilogue">{formik.errors.userRole}</div>
          )}
        </div>

        <div className="flex justify-center items-center mt-[30px]">
          <button
            type="submit"
            disabled={loading}
            className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#1dc071] hover:bg-[#0bb15e] transition-all w-full ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Registering...' : 'Register User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserRegistrationForm; 