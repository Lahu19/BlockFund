import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useWeb3Contract } from '../../hooks/useWeb3Contract';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

const KycVerificationForm = () => {
  const { contract, account, error: web3Error, connectWallet } = useWeb3Contract();
  const [isAdmin, setIsAdmin] = useState(true);
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (contract && account) {
        try {
          const adminAddress = await contract.admin();
          setIsAdmin(adminAddress.toLowerCase() === account.toLowerCase());
        } catch (error) {
          console.error('Failed to check admin status:', error);
          setIsAdmin(true);
        }
      }
    };

    checkAdminStatus();
  }, [contract, account]);

  const validationSchema = Yup.object().shape({
    userAddress: Yup.string()
      .required('User address is required')
      .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
    fullName: Yup.string()
      .required('Full name is required')
      .min(2, 'Name must be at least 2 characters'),
    userRole: Yup.string()
      .required('User role is required')
      .oneOf(['donor', 'politician', 'auditor'], 'Invalid user role'),
    documentType: Yup.string()
      .required('Document type is required'),
    documentNumber: Yup.string()
      .required('Document number is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmissionError(null);
      setSubmissionSuccess(false);

      if (!contract) {
        throw new Error('Smart contract not initialized');
      }

      // if (!isAdmin) {
      //   throw new Error('Only administrators can verify KYC');
      // }

      // Show pending toast
      const pendingToast = toast.loading('Processing KYC verification...');

      // First register the user if not already registered
      try {
        const tx1 = await contract.registerUser(
          values.fullName,
          values.userRole,
          {
            from: values.userAddress
          }
        );
        await tx1.wait();
      } catch (error) {
        // Ignore if user already registered
        if (!error.message.includes('User already registered')) {
          throw error;
        }
      }

      // Then verify KYC
      const tx2 = await contract.verifyKyc(values.userAddress);
      await tx2.wait();

      toast.update(pendingToast, {
        render: 'KYC verification completed successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 5000
      });

      setSubmissionSuccess(true);
      resetForm();
    } catch (error) {
      console.error('KYC verification error:', error);
      const errorMessage = error.message || 'Failed to verify KYC';
      setSubmissionError(errorMessage);
      
      toast.error(
        <div>
          <p>Failed to verify KYC</p>
          <p className="text-sm mt-1">{errorMessage}</p>
        </div>,
        {
          position: "top-right",
          autoClose: 5000
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!account) {
    return (
      <div className="bg-[#1c1c24] flex justify-center items-start flex-col rounded-[10px] sm:p-10 p-4">
        <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px] max-w-[480px] mx-auto w-full">
          <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white text-center">KYC Verification</h1>
        </div>
        <button
          onClick={connectWallet}
          className="mt-[20px] font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#8c6dfd] hover:bg-[#7c5dfd] transition-all w-full"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="bg-[#1c1c24] flex justify-center items-start flex-col rounded-[10px] sm:p-10 p-4">
        <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px] max-w-[480px] mx-auto w-full">
          <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white text-center">KYC Verification</h1>
        </div>
        <div className="mt-[20px] w-full bg-[#3a3a43] p-4 rounded-[10px]">
          <p className="font-epilogue text-[14px] text-white">
            Only administrators can access the KYC verification system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1c1c24] flex justify-center items-start flex-col rounded-[10px] sm:p-10 p-4">
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px] max-w-[480px] mx-auto w-full">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white text-center">KYC Verification</h1>
      </div>

      {web3Error && (
        <div className="mt-[20px] w-full bg-[#3a3a43] p-4 rounded-[10px] border-l-4 border-[#ed3f3f]">
          <p className="font-epilogue text-[14px] text-[#ed3f3f]">{web3Error}</p>
        </div>
      )}

      {submissionError && (
        <div className="mt-[20px] w-full bg-[#3a3a43] p-4 rounded-[10px] border-l-4 border-[#ed3f3f]">
          <p className="font-epilogue text-[14px] text-[#ed3f3f]">{submissionError}</p>
        </div>
      )}

      {submissionSuccess && (
        <div className="mt-[20px] w-full bg-[#3a3a43] p-4 rounded-[10px] border-l-4 border-[#1dc071]">
          <p className="font-epilogue text-[14px] text-[#1dc071]">KYC verification completed successfully!</p>
        </div>
      )}

      <Formik
        initialValues={{
          userAddress: '',
          fullName: '',
          userRole: '',
          documentType: '',
          documentNumber: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="w-full mt-[65px] flex flex-col gap-[30px]">
            <div>
              <label className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px] block">
                User Wallet Address
              </label>
              <Field
                type="text"
                name="userAddress"
                className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] w-full"
              />
              {errors.userAddress && touched.userAddress && (
                <p className="mt-1 text-[#ed3f3f] text-[12px] font-epilogue">{errors.userAddress}</p>
              )}
            </div>

            <div>
              <label className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px] block">
                Full Name
              </label>
              <Field
                type="text"
                name="fullName"
                className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] w-full"
              />
              {errors.fullName && touched.fullName && (
                <p className="mt-1 text-[#ed3f3f] text-[12px] font-epilogue">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px] block">
                User Role
              </label>
              <Field
                as="select"
                name="userRole"
                className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-[#1c1c24] font-epilogue text-white text-[14px] rounded-[10px] sm:min-w-[300px] w-full"
              >
                <option value="">Select a role</option>
                <option value="donor">Donor</option>
                <option value="politician">Politician</option>
                <option value="auditor">Auditor</option>
              </Field>
              {errors.userRole && touched.userRole && (
                <p className="mt-1 text-[#ed3f3f] text-[12px] font-epilogue">{errors.userRole}</p>
              )}
            </div>

            <div>
              <label className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px] block">
                Document Type
              </label>
              <Field
                as="select"
                name="documentType"
                className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-[#1c1c24] font-epilogue text-white text-[14px] rounded-[10px] sm:min-w-[300px] w-full"
              >
                <option value="">Select a document type</option>
                <option value="passport">Passport</option>
                <option value="national_id">National ID</option>
                <option value="drivers_license">Driver's License</option>
              </Field>
              {errors.documentType && touched.documentType && (
                <p className="mt-1 text-[#ed3f3f] text-[12px] font-epilogue">{errors.documentType}</p>
              )}
            </div>

            <div>
              <label className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px] block">
                Document Number
              </label>
              <Field
                type="text"
                name="documentNumber"
                className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] w-full"
              />
              {errors.documentNumber && touched.documentNumber && (
                <p className="mt-1 text-[#ed3f3f] text-[12px] font-epilogue">{errors.documentNumber}</p>
              )}
            </div>

            <div className="flex justify-center items-center mt-[30px]">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#1dc071] hover:bg-[#0bb15e] transition-all w-full ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Verify KYC'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default KycVerificationForm; 