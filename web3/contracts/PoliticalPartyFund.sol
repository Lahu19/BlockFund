// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PoliticalPartyFund {
    struct Party {
        string name;
        string leader;
        string registrationNumber;
        uint256 totalDonations;
        bool isActive;
        address leaderAddress;
    }

    struct Donation {
        address donor;
        uint256 partyId;
        uint256 amount;
        uint256 timestamp;
        string message;
    }

    struct User {
        string fullName;
        string userRole; // "donor", "politician", "auditor"
        bool isKycVerified;
        bool isActive;
    }

    struct Campaign {
        string name;
        string description;
        uint256 goal;
        uint256 raised;
        uint256 deadline;
        uint256 partyId;
        address creator;
        bool isActive;
        bool isFunded;
    }

    mapping(uint256 => Party) public parties;
    mapping(address => User) public users;
    mapping(uint256 => Donation[]) public partyDonations;
    mapping(uint256 => Campaign) public campaigns;
    uint256 public partyCount;
    uint256 public campaignCount;
    address public admin;

    event PartyRegistered(uint256 indexed partyId, string name, string leader);
    event UserRegistered(address indexed user, string fullName, string userRole);
    event DonationMade(uint256 indexed partyId, address indexed donor, uint256 amount);
    event KycVerified(address indexed user, bool status);
    event FundsWithdrawn(uint256 indexed partyId, address indexed leader, uint256 amount);
    event PartyStatusChanged(uint256 indexed partyId, bool isActive);
    event CampaignCreated(
        uint256 indexed campaignId,
        string name,
        uint256 goal,
        uint256 deadline,
        uint256 partyId
    );
    event CampaignFunded(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyKycVerified() {
        require(users[msg.sender].isKycVerified, "User must be KYC verified");
        _;
    }

    modifier onlyPartyLeader(uint256 _partyId) {
        require(parties[_partyId].leaderAddress == msg.sender, "Only party leader can perform this action");
        _;
    }

    function registerParty(
        string memory _name,
        string memory _leader,
        string memory _registrationNumber,
        address _leaderAddress
    ) public onlyAdmin {
        partyCount++;
        parties[partyCount] = Party({
            name: _name,
            leader: _leader,
            registrationNumber: _registrationNumber,
            totalDonations: 0,
            isActive: true,
            leaderAddress: _leaderAddress
        });
        emit PartyRegistered(partyCount, _name, _leader);
    }

    function registerUser(
        string memory _fullName,
        string memory _userRole
    ) public {
        require(!users[msg.sender].isActive, "User already registered");
        users[msg.sender] = User({
            fullName: _fullName,
            userRole: _userRole,
            isKycVerified: false,
            isActive: true
        });
        emit UserRegistered(msg.sender, _fullName, _userRole);
    }

    function verifyKyc(address _user) public onlyAdmin {
        require(users[_user].isActive, "User not registered");
        users[_user].isKycVerified = true;
        emit KycVerified(_user, true);
    }

    function makeDonation(
        uint256 _partyId,
        string memory _message
    ) public payable onlyKycVerified {
        require(parties[_partyId].isActive, "Party not active");
        require(msg.value > 0, "Donation amount must be greater than 0");

        parties[_partyId].totalDonations += msg.value;
        partyDonations[_partyId].push(Donation({
            donor: msg.sender,
            partyId: _partyId,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message
        }));

        emit DonationMade(_partyId, msg.sender, msg.value);
    }

    function withdrawFunds(uint256 _partyId) public onlyPartyLeader(_partyId) {
        require(parties[_partyId].isActive, "Party not active");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        parties[_partyId].totalDonations = 0; // Reset the total donations
        payable(parties[_partyId].leaderAddress).transfer(balance);
        
        emit FundsWithdrawn(_partyId, parties[_partyId].leaderAddress, balance);
    }

    function getParty(uint256 _partyId) public view returns (
        string memory name,
        string memory leader,
        string memory registrationNumber,
        uint256 totalDonations,
        bool isActive,
        address leaderAddress
    ) {
        Party memory party = parties[_partyId];
        return (
            party.name,
            party.leader,
            party.registrationNumber,
            party.totalDonations,
            party.isActive,
            party.leaderAddress
        );
    }

    function getUser(address _user) public view returns (
        string memory fullName,
        string memory userRole,
        bool isKycVerified,
        bool isActive
    ) {
        User memory user = users[_user];
        return (
            user.fullName,
            user.userRole,
            user.isKycVerified,
            user.isActive
        );
    }

    function getPartyDonations(uint256 _partyId) public view returns (Donation[] memory) {
        return partyDonations[_partyId];
    }

    function createCampaign(
        string memory _name,
        string memory _description,
        uint256 _goal,
        uint256 _duration,
        uint256 _partyId
    ) public onlyKycVerified {
        require(parties[_partyId].isActive, "Party not active");
        require(_goal > 0, "Goal must be greater than 0");
        require(_duration > 0 && _duration <= 365, "Duration must be between 1 and 365 days");

        uint256 campaignId = campaignCount++;
        uint256 deadline = block.timestamp + (_duration * 1 days);

        campaigns[campaignId] = Campaign({
            name: _name,
            description: _description,
            goal: _goal,
            raised: 0,
            deadline: deadline,
            partyId: _partyId,
            creator: msg.sender,
            isActive: true,
            isFunded: false
        });

        emit CampaignCreated(campaignId, _name, _goal, deadline, _partyId);
    }

    function fundCampaign(uint256 _campaignId) public payable onlyKycVerified {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.isActive, "Campaign is not active");
        require(block.timestamp <= campaign.deadline, "Campaign has ended");
        require(msg.value > 0, "Must send ETH to fund campaign");

        campaign.raised += msg.value;
        
        if (campaign.raised >= campaign.goal) {
            campaign.isFunded = true;
            campaign.isActive = false;
            parties[campaign.partyId].totalDonations += campaign.raised;
        }

        emit CampaignFunded(_campaignId, msg.sender, msg.value);
    }

    function getCampaign(uint256 _campaignId) public view returns (
        string memory name,
        string memory description,
        uint256 goal,
        uint256 raised,
        uint256 deadline,
        uint256 partyId,
        address creator,
        bool isActive,
        bool isFunded
    ) {
        Campaign memory campaign = campaigns[_campaignId];
        return (
            campaign.name,
            campaign.description,
            campaign.goal,
            campaign.raised,
            campaign.deadline,
            campaign.partyId,
            campaign.creator,
            campaign.isActive,
            campaign.isFunded
        );
    }

    function togglePartyStatus(uint256 _partyId) public onlyAdmin {
        require(_partyId > 0 && _partyId <= partyCount, "Invalid party ID");
        Party storage party = parties[_partyId];
        party.isActive = !party.isActive;
        emit PartyStatusChanged(_partyId, party.isActive);
    }
} 