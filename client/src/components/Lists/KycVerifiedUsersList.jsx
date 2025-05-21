import React from 'react';

const KycVerifiedUsersList = ({ users, isAdmin, onToggleStatus, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-[#3a3a43] rounded-[10px] p-4">
        <p className="font-epilogue text-[14px] text-[#808191]">Loading users...</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="bg-[#3a3a43] rounded-[10px] p-4">
        <p className="font-epilogue text-[14px] text-[#808191]">We are under maintenance.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-[#1c1c24] rounded-[10px] p-4">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#3a3a43]">
            <th className="font-epilogue text-white text-left p-4">Address</th>
            <th className="font-epilogue text-white text-left p-4">Full Name</th>
            <th className="font-epilogue text-white text-left p-4">Role</th>
            <th className="font-epilogue text-white text-left p-4">Status</th>
            <th className="font-epilogue text-white text-left p-4">Active</th>
            {isAdmin && <th className="font-epilogue text-white text-left p-4">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.address} className="border-b border-[#3a3a43] hover:bg-[#2c2f32]">
              <td className="font-epilogue text-[14px] text-white p-4">
                {user.address.slice(0, 6)}...{user.address.slice(-4)}
              </td>
              <td className="font-epilogue text-[14px] text-white p-4">{user.fullName}</td>
              <td className="font-epilogue text-[14px] text-white p-4">{user.role}</td>
              <td className="font-epilogue text-[14px] p-4">
                <span className={`px-2 py-1 rounded-full ${
                  user.isVerified ? 'bg-[#1dc071] text-white' : 'bg-[#ed3f3f] text-white'
                }`}>
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </td>
              <td className="font-epilogue text-[14px] p-4">
                <span className={`px-2 py-1 rounded-full ${
                  user.isActive ? 'bg-[#1dc071] text-white' : 'bg-[#ed3f3f] text-white'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              {isAdmin && !user.isVerified && (
                <td className="font-epilogue text-[14px] p-4">
                  <button
                    onClick={() => onToggleStatus(user.address, false)}
                    className="font-epilogue font-semibold text-[14px] leading-[22px] text-white min-h-[40px] px-4 rounded-[10px] w-full bg-[#1dc071] hover:bg-[#0bb15e] transition-all"
                  >
                    Verify
                  </button>
                </td>
              )}
              {isAdmin && user.isVerified && (
                <td className="font-epilogue text-[14px] p-4">
                  <span className="text-[#808191]">Already Verified</span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KycVerifiedUsersList; 