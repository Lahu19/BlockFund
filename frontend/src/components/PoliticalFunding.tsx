import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import contractABI from '../contracts/PoliticalPartyFund.json';

interface Party {
  name: string;
  wallet: string;
  totalFunds: string;
  isRegistered: boolean;
}

interface Donation {
  donor: string;
  amount: string;
  timestamp: number;
  message: string;
}

const CONTRACT_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

const PoliticalFunding: React.FC = () => {
  const [provider, setProvider] = useState<Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>('');
  const [partyName, setPartyName] = useState<string>('');
  const [donationAmount, setDonationAmount] = useState<string>('');
  const [donationMessage, setDonationMessage] = useState<string>('');
  const [partyAddress, setPartyAddress] = useState<string>('');
  const [partyDetails, setPartyDetails] = useState<Party | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Request network switch to local Hardhat network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x7A69' }], // 31337 in hex
          });
        } catch (switchError: any) {
          // If the network doesn't exist, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x7A69',
                  chainName: 'Localhost 8545',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['http://127.0.0.1:8545'],
                  blockExplorerUrls: []
                }]
              });
            } catch (addError) {
              console.error('Error adding local Hardhat network:', addError);
            }
          } else {
            console.error('Error switching to local Hardhat network:', switchError);
          }
        }

        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const web3Signer = web3Provider.getSigner();
        const fundingContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI.abi,
          web3Signer
        );

        setProvider(web3Provider);
        setContract(fundingContract);

        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };

    init();
  }, []);

  const connectWallet = async () => {
    if (provider && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      console.error('Please install MetaMask!');
    }
  };

  const registerParty = async () => {
    if (!contract || !partyName) return;

    try {
      const tx = await contract.registerParty(partyName);
      await tx.wait();
      alert('Party registered successfully!');
    } catch (error) {
      console.error('Error registering party:', error);
    }
  };

  const donate = async () => {
    if (!contract || !donationAmount || !partyAddress) return;

    try {
      const amount = ethers.utils.parseEther(donationAmount);
      const tx = await contract.donate(partyAddress, donationMessage, {
        value: amount,
      });
      await tx.wait();
      alert('Donation successful!');
    } catch (error) {
      console.error('Error donating:', error);
    }
  };

  const getPartyDetails = async () => {
    if (!contract || !partyAddress) return;

    try {
      const details = await contract.getPartyDetails(partyAddress);
      setPartyDetails({
        name: details.name,
        wallet: details.wallet,
        totalFunds: ethers.utils.formatEther(details.totalFunds),
        isRegistered: details.isRegistered,
      });

      const partyDonations = await contract.getPartyDonations(partyAddress);
      setDonations(
        partyDonations.map((d: any) => ({
          donor: d.donor,
          amount: ethers.utils.formatEther(d.amount),
          timestamp: d.timestamp.toNumber(),
          message: d.message,
        }))
      );
    } catch (error) {
      console.error('Error fetching party details:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Political Party Funding Platform</h1>

      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Register Party</h2>
            <input
              type="text"
              placeholder="Party Name"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              className="border p-2 rounded mr-2"
            />
            <button
              onClick={registerParty}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Register
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Make Donation</h2>
            <input
              type="text"
              placeholder="Party Address"
              value={partyAddress}
              onChange={(e) => setPartyAddress(e.target.value)}
              className="border p-2 rounded mr-2"
            />
            <input
              type="number"
              placeholder="Amount (ETH)"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="border p-2 rounded mr-2"
            />
            <input
              type="text"
              placeholder="Message (optional)"
              value={donationMessage}
              onChange={(e) => setDonationMessage(e.target.value)}
              className="border p-2 rounded mr-2"
            />
            <button
              onClick={donate}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Donate
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Party Details</h2>
            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Party Address"
                value={partyAddress}
                onChange={(e) => setPartyAddress(e.target.value)}
                className="border p-2 rounded mr-2"
              />
              <button
                onClick={getPartyDetails}
                className="bg-purple-500 text-white px-4 py-2 rounded"
              >
                Get Details
              </button>
            </div>

            {partyDetails && (
              <div className="mb-4">
                <h3 className="font-semibold">Party Information:</h3>
                <p>Name: {partyDetails.name}</p>
                <p>Wallet: {partyDetails.wallet}</p>
                <p>Total Funds: {partyDetails.totalFunds} ETH</p>
                <p>Registered: {partyDetails.isRegistered ? 'Yes' : 'No'}</p>
              </div>
            )}

            {donations.length > 0 && (
              <div>
                <h3 className="font-semibold">Donation History:</h3>
                <div className="space-y-2">
                  {donations.map((donation, index) => (
                    <div key={index} className="border p-2 rounded">
                      <p>Donor: {donation.donor}</p>
                      <p>Amount: {donation.amount} ETH</p>
                      <p>
                        Date:{' '}
                        {new Date(donation.timestamp * 1000).toLocaleString()}
                      </p>
                      <p>Message: {donation.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PoliticalFunding; 