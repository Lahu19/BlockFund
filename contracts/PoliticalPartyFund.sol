// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PoliticalPartyFund {
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
        string message;
    }

    struct Party {
        string name;
        address payable wallet;
        uint256 totalFunds;
        bool isRegistered;
    }

    mapping(address => Party) public parties;
    mapping(address => Donation[]) public partyDonations;
    mapping(address => mapping(address => uint256)) public donorContributions;

    event PartyRegistered(address indexed partyAddress, string name);
    event DonationReceived(
        address indexed partyAddress,
        address indexed donor,
        uint256 amount,
        string message
    );
    event FundsWithdrawn(address indexed partyAddress, uint256 amount);

    modifier onlyRegisteredParty() {
        require(parties[msg.sender].isRegistered, "Party is not registered");
        _;
    }

    function registerParty(string memory _name) external {
        require(!parties[msg.sender].isRegistered, "Party already registered");
        require(bytes(_name).length > 0, "Party name cannot be empty");

        parties[msg.sender] = Party({
            name: _name,
            wallet: payable(msg.sender),
            totalFunds: 0,
            isRegistered: true
        });

        emit PartyRegistered(msg.sender, _name);
    }

    function donate(address _partyAddress, string memory _message) external payable {
        require(parties[_partyAddress].isRegistered, "Party not registered");
        require(msg.value > 0, "Donation amount must be greater than 0");

        Party storage party = parties[_partyAddress];
        party.totalFunds += msg.value;
        donorContributions[_partyAddress][msg.sender] += msg.value;

        Donation memory newDonation = Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message
        });

        partyDonations[_partyAddress].push(newDonation);

        emit DonationReceived(_partyAddress, msg.sender, msg.value, _message);
    }

    function withdrawFunds(uint256 _amount) external onlyRegisteredParty {
        Party storage party = parties[msg.sender];
        require(_amount <= party.totalFunds, "Insufficient funds");

        party.totalFunds -= _amount;
        party.wallet.transfer(_amount);

        emit FundsWithdrawn(msg.sender, _amount);
    }

    function getPartyDetails(address _partyAddress)
        external
        view
        returns (
            string memory name,
            address wallet,
            uint256 totalFunds,
            bool isRegistered
        )
    {
        Party memory party = parties[_partyAddress];
        return (party.name, party.wallet, party.totalFunds, party.isRegistered);
    }

    function getPartyDonations(address _partyAddress)
        external
        view
        returns (Donation[] memory)
    {
        return partyDonations[_partyAddress];
    }

    function getDonorContribution(address _partyAddress, address _donor)
        external
        view
        returns (uint256)
    {
        return donorContributions[_partyAddress][_donor];
    }
} 