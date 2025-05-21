import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logo, sun, createCampaign as create_campaign, dashboard, logout, payment, profile, withdraw } from '../assets';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { BiUser, BiDonateHeart, BiParty } from 'react-icons/bi';
import { MdVerifiedUser, MdOutlineHowToVote } from 'react-icons/md';

const navItems = [
  {
    name: 'Dashboard',
    icon: dashboard,
    link: '/',
  },
  {
    name: 'Campaigns',
    icon: create_campaign,
    link: '/campaigns',
    subItems: [
      { name: 'All Campaigns', link: '/campaigns' },
      { name: 'Create Campaign', link: '/campaigns/new' },
    ]
  },
  {
    name: 'Political Parties',
    icon: BiParty,
    link: '/political-parties',
    subItems: [
      { name: 'All Parties', link: '/political-parties' },
      { name: 'Register Party', link: '/party-registration' },
    ]
  },
  {
    name: 'Users',
    icon: BiUser,
    link: '/users',
    subItems: [
      { name: 'All Users', link: '/users' },
      { name: 'KYC Verified', link: '/kyc-users' },
      { name: 'KYC Verification', link: '/kyc-verification' },
    ]
  },
  {
    name: 'Donations',
    icon: BiDonateHeart,
    link: '/donations',
    subItems: [
      { name: 'All Donations', link: '/donations' },
      { name: 'Make Donation', link: '/donate' },
    ]
  },
  {
    name: 'Voting',
    icon: MdOutlineHowToVote,
    link: '/voting',
    subItems: [
      { name: 'Active Polls', link: '/voting' },
      { name: 'Create Poll', link: '/voting/create' },
      { name: 'Results', link: '/voting/results' },
    ]
  },
];

const NavItem = ({ item, isActive, isOpen, onToggle, level = 0 }) => {
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const location = useLocation();

  const content = (
    <>
      <div className="flex items-center flex-1">
        {typeof item.icon === 'function' ? (
          <item.icon className="w-6 h-6 text-white" />
        ) : (
          <img src={item.icon} alt="nav icon" className="w-6 h-6" />
        )}
        <span className="ml-3 font-epilogue text-white">{item.name}</span>
      </div>
      {hasSubItems && (
        <div className="ml-2">
          {isOpen ? (
            <FiChevronDown className="w-5 h-5 text-white" />
          ) : (
            <FiChevronRight className="w-5 h-5 text-white" />
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="w-full">
      {hasSubItems ? (
        <div 
          className={`flex items-center px-4 py-3 cursor-pointer transition-all
            ${isActive ? 'bg-[#2c2f32]' : 'hover:bg-[#2c2f32]'}
            ${level > 0 ? 'pl-8' : ''}`}
          onClick={onToggle}
        >
          {content}
        </div>
      ) : (
        <Link
          to={item.link}
          className={`flex items-center px-4 py-3 cursor-pointer transition-all
            ${isActive ? 'bg-[#2c2f32]' : 'hover:bg-[#2c2f32]'}
            ${level > 0 ? 'pl-8' : ''}`}
        >
          {content}
        </Link>
      )}

      {hasSubItems && isOpen && (
        <div className="bg-[#1c1c24]">
          {item.subItems.map((subItem) => (
            <Link 
              key={subItem.link} 
              to={subItem.link}
              className={`flex items-center px-4 py-2 pl-12 transition-all
                ${location.pathname === subItem.link ? 'bg-[#2c2f32]' : 'hover:bg-[#2c2f32]'}`}
            >
              <span className="font-epilogue text-[14px] text-white">{subItem.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const CustomSidebar = () => {
  const [openItems, setOpenItems] = useState({});
  const location = useLocation();

  const toggleItem = (itemName) => {
    setOpenItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const isItemActive = (item) => {
    if (location.pathname === item.link) return true;
    if (item.subItems) {
      return item.subItems.some(subItem => location.pathname === subItem.link);
    }
    return false;
  };

  return (
    <div className="flex flex-col justify-between items-center sticky top-5 h-[93vh]">
      <Link to="/" className="w-full flex justify-center items-center bg-[#2c2f32] rounded-[10px] h-14">
        <img src={logo} alt="logo" className="w-10 h-10" />
        <span className="ml-3 font-epilogue font-bold text-white">BlockFund</span>
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[250px] py-4 mt-12">
        <div className="flex flex-col w-full">
          {navItems.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isActive={isItemActive(item)}
              isOpen={openItems[item.name]}
              onToggle={() => toggleItem(item.name)}
            />
          ))}
        </div>

        <div className="w-full px-4">
          <div className="w-full h-[1px] bg-[#3a3a43] my-4" />
          
          <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-[#2c2f32] transition-all">
            <img src={sun} alt="sun" className="w-6 h-6" />
            <span className="ml-3 font-epilogue text-white">Light Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSidebar; 