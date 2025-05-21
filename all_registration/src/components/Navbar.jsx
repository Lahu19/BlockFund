import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { CustomButton } from './';
import { logo, menu, search, thirdweb } from '../assets';
import { useWeb3Contract } from '../hooks/useWeb3Contract';

const Navbar = () => {
  const { address, connectWallet } = useStateContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin } = useWeb3Contract();

  // const navItems = [
  //   {
  //     title: 'Campaigns',
  //     path: '/campaigns',
  //     requiresAuth: true
  //   },
  //   {
  //     title: 'Donations',
  //     path: '/donations',
  //     requiresAuth: true
  //   },
  //   {
  //     title: 'Profile',
  //     path: '/profile',
  //     requiresAuth: true
  //   },
  //   {
  //     title: 'KYC Verification',
  //     path: '/kyc-verification',
  //     requiresAuth: isAdmin
  //   },
  //   {
  //     title: 'Party Registration',
  //     path: '/party-registration',
  //     requiresAuth: isAdmin
  //   }
  // ];

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
        <input 
          type="text"
          placeholder="Search for campaigns"
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
        />
        <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
          <img src={search} alt="search" className="w-[15px] h-[15px] object-contain"/>
        </div>
      </div>

      <div className="sm:flex hidden flex-row justify-end gap-4 items-center">
        {/* {address && (
          <div className="flex gap-4">
            {navItems
              .filter(item => !item.requiresAuth || (item.requiresAuth === true) || (item.requiresAuth === isAdmin))
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="font-epilogue font-semibold text-[14px] text-white hover:text-[#1dc071] transition-colors"
                >
                  {item.title}
                </Link>
              ))}
          </div>
        )} */}

        <CustomButton 
          btnType="button"
          title={address ? address.slice(0, 6) + '...' + address.slice(-4) : 'Connect'}
          styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
          handleClick={() => {
            if(address) {
              navigate('/');
            } else {
              connectWallet();
            }
          }}
        />
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <img src={logo} alt="user" className="w-[60%] h-[60%] object-contain"/>
        </div>

        <img 
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4">
            {address ? (
              <>
                {navItems
                  .filter(item => !item.requiresAuth || (item.requiresAuth === true) || (item.requiresAuth === isAdmin))
                  .map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center px-4 py-2 font-epilogue font-semibold text-[14px] text-white hover:bg-[#3a3a43]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
              </>
            ) : (
              <button
                className="flex items-center px-4 py-2 font-epilogue font-semibold text-[14px] text-white hover:bg-[#3a3a43] w-full"
                onClick={() => {
                  connectWallet();
                  setIsMenuOpen(false);
                }}
              >
                Connect Wallet
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;