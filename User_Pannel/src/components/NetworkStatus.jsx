import React from 'react';
import { useWeb3Contract } from '../hooks/useWeb3Contract';

const NetworkStatus = () => {
  const { account, error, isCorrectNetwork, connectWallet } = useWeb3Contract();

  return (
    <div className="fixed top-4 right-4 p-4 rounded-lg shadow-secondary bg-[#1c1c24]">
      <div className="space-y-2">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isCorrectNetwork ? 'bg-[#1dc071]' : 'bg-red-500'}`} />
              <span className="text-sm text-white font-epilogue">
                {isCorrectNetwork ? 'Connected to GoChain Testnet' : 'Wrong Network - Please connect to GoChain Testnet'}
              </span>
            </div>
            
            {account ? (
              <div className="text-sm text-[#808191] font-epilogue">
                Account: {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 text-sm font-epilogue font-medium text-white bg-[#8c6dfd] rounded-[10px] hover:bg-[#7c5dfd] focus:outline-none focus:ring-2 focus:ring-[#1dc071]"
              >
                Connect Wallet
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NetworkStatus; 