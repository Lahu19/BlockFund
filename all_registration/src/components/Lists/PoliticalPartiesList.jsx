import React from 'react';

const PoliticalPartiesList = ({ parties, isAdmin, onToggleStatus, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-[#3a3a43] rounded-[10px] p-4">
        <p className="font-epilogue text-[14px] text-[#808191]">Loading parties...</p>
      </div>
    );
  }

  if (!parties || parties.length === 0) {
    return (
      <div className="bg-[#3a3a43] rounded-[10px] p-4">
        <p className="font-epilogue text-[14px] text-[#808191]">No parties registered yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-[#1c1c24] rounded-[10px] p-4">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#3a3a43]">
            <th className="font-epilogue text-white text-left p-4">ID</th>
            <th className="font-epilogue text-white text-left p-4">Name</th>
            <th className="font-epilogue text-white text-left p-4">Leader</th>
            <th className="font-epilogue text-white text-left p-4">Registration No.</th>
            <th className="font-epilogue text-white text-left p-4">Status</th>
            <th className="font-epilogue text-white text-left p-4">Total Donations</th>
            {isAdmin && <th className="font-epilogue text-white text-left p-4">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {parties.map((party) => (
            <tr key={party.id} className="border-b border-[#3a3a43] hover:bg-[#2c2f32]">
              <td className="font-epilogue text-[14px] text-white p-4">{party.id}</td>
              <td className="font-epilogue text-[14px] text-white p-4">{party.name}</td>
              <td className="font-epilogue text-[14px] text-white p-4">{party.leader}</td>
              <td className="font-epilogue text-[14px] text-white p-4">{party.registrationNumber}</td>
              <td className="font-epilogue text-[14px] p-4">
                <span className={`px-2 py-1 rounded-full ${
                  party.isActive ? 'bg-[#1dc071] text-white' : 'bg-[#ed3f3f] text-white'
                }`}>
                  {party.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="font-epilogue text-[14px] text-white p-4">{party.totalDonations} GO</td>
              {isAdmin && (
                <td className="font-epilogue text-[14px] p-4">
                  <button
                    onClick={() => onToggleStatus(party.id, party.isActive)}
                    className={`font-epilogue font-semibold text-[14px] leading-[22px] text-white min-h-[40px] px-4 rounded-[10px] w-full ${
                      party.isActive
                        ? 'bg-[#ed3f3f] hover:bg-[#dd2e2e]'
                        : 'bg-[#1dc071] hover:bg-[#0bb15e]'
                    } transition-all`}
                  >
                    {party.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PoliticalPartiesList; 