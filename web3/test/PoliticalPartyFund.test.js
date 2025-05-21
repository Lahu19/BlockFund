const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PoliticalPartyFund", function () {
    let PoliticalPartyFund;
    let politicalPartyFund;
    let owner;
    let partyLeader;
    let donor;
    let addr1;
    let addr2;

    beforeEach(async function () {
        // Get signers
        [owner, partyLeader, donor, addr1, addr2] = await ethers.getSigners();

        // Deploy contract
        PoliticalPartyFund = await ethers.getContractFactory("PoliticalPartyFund");
        politicalPartyFund = await PoliticalPartyFund.deploy();
        await politicalPartyFund.deployed();
    });

    describe("Party Registration", function () {
        it("Should register a new party", async function () {
            await politicalPartyFund.registerParty(
                "Test Party",
                "Test Leader",
                "REG123",
                partyLeader.address
            );

            const party = await politicalPartyFund.getParty(1);
            expect(party.name).to.equal("Test Party");
            expect(party.leader).to.equal("Test Leader");
            expect(party.registrationNumber).to.equal("REG123");
            expect(party.leaderAddress).to.equal(partyLeader.address);
            expect(party.isActive).to.be.true;
        });

        it("Should only allow admin to register party", async function () {
            try {
                await politicalPartyFund.connect(addr1).registerParty(
                    "Test Party",
                    "Test Leader",
                    "REG123",
                    partyLeader.address
                );
                expect.fail("Should have thrown error");
            } catch (error) {
                expect(error.message).to.include("Only admin can perform this action");
            }
        });

        it("Should allow admin to toggle party status", async function () {
            await politicalPartyFund.registerParty(
                "Test Party",
                "Test Leader",
                "REG123",
                partyLeader.address
            );

            await politicalPartyFund.togglePartyStatus(1);
            let party = await politicalPartyFund.getParty(1);
            expect(party.isActive).to.be.false;

            await politicalPartyFund.togglePartyStatus(1);
            party = await politicalPartyFund.getParty(1);
            expect(party.isActive).to.be.true;
        });

        it("Should not allow non-admin to toggle party status", async function () {
            await politicalPartyFund.registerParty(
                "Test Party",
                "Test Leader",
                "REG123",
                partyLeader.address
            );

            try {
                await politicalPartyFund.connect(addr1).togglePartyStatus(1);
                expect.fail("Should have thrown error");
            } catch (error) {
                expect(error.message).to.include("Only admin can perform this action");
            }
        });
    });

    describe("User Registration and KYC", function () {
        it("Should register a new user", async function () {
            await politicalPartyFund.connect(donor).registerUser(
                "John Doe",
                "donor"
            );

            const user = await politicalPartyFund.getUser(donor.address);
            expect(user.fullName).to.equal("John Doe");
            expect(user.userRole).to.equal("donor");
            expect(user.isKycVerified).to.be.false;
            expect(user.isActive).to.be.true;
        });

        it("Should not allow duplicate user registration", async function () {
            await politicalPartyFund.connect(donor).registerUser(
                "John Doe",
                "donor"
            );

            try {
                await politicalPartyFund.connect(donor).registerUser(
                    "John Doe Again",
                    "donor"
                );
                expect.fail("Should have thrown error");
            } catch (error) {
                expect(error.message).to.include("User already registered");
            }
        });

        it("Should verify KYC for registered user", async function () {
            await politicalPartyFund.connect(donor).registerUser(
                "John Doe",
                "donor"
            );
            await politicalPartyFund.verifyKyc(donor.address);

            const user = await politicalPartyFund.getUser(donor.address);
            expect(user.isKycVerified).to.be.true;
        });

        it("Should not verify KYC for unregistered user", async function () {
            try {
                await politicalPartyFund.verifyKyc(donor.address);
                expect.fail("Should have thrown error");
            } catch (error) {
                expect(error.message).to.include("User not registered");
            }
        });
    });

    describe("Donations", function () {
        beforeEach(async function () {
            await politicalPartyFund.registerParty(
                "Test Party",
                "Test Leader",
                "REG123",
                partyLeader.address
            );

            await politicalPartyFund.connect(donor).registerUser(
                "John Doe",
                "donor"
            );
            await politicalPartyFund.verifyKyc(donor.address);
        });

        it("Should allow KYC verified users to make donations", async function () {
            const donationAmount = ethers.utils.parseEther("1.0");
            await politicalPartyFund.connect(donor).makeDonation(
                1,
                "Test donation",
                { value: donationAmount }
            );

            const party = await politicalPartyFund.getParty(1);
            expect(party.totalDonations.eq(donationAmount)).to.be.true;

            const donations = await politicalPartyFund.getPartyDonations(1);
            expect(donations[0].donor).to.equal(donor.address);
            expect(donations[0].amount.eq(donationAmount)).to.be.true;
            expect(donations[0].message).to.equal("Test donation");
        });

        it("Should not allow non-KYC verified users to donate", async function () {
            const donationAmount = ethers.utils.parseEther("1.0");
            try {
                await politicalPartyFund.connect(addr1).makeDonation(
                    1,
                    "Test donation",
                    { value: donationAmount }
                );
                expect.fail("Should have thrown error");
            } catch (error) {
                expect(error.message).to.include("User must be KYC verified");
            }
        });

        it("Should not allow donations to inactive party", async function () {
            await politicalPartyFund.togglePartyStatus(1);
            const donationAmount = ethers.utils.parseEther("1.0");
            
            try {
                await politicalPartyFund.connect(donor).makeDonation(
                    1,
                    "Test donation",
                    { value: donationAmount }
                );
                expect.fail("Should have thrown error");
            } catch (error) {
                expect(error.message).to.include("Party not active");
            }
        });

        it("Should allow party leader to withdraw funds", async function () {
            const donationAmount = ethers.utils.parseEther("1.0");
            await politicalPartyFund.connect(donor).makeDonation(
                1,
                "Test donation",
                { value: donationAmount }
            );

            const initialBalance = await partyLeader.getBalance();
            const tx = await politicalPartyFund.connect(partyLeader).withdrawFunds(1);
            const receipt = await tx.wait();
            const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);
            
            const finalBalance = await partyLeader.getBalance();
            expect(finalBalance.add(gasUsed).sub(initialBalance).eq(donationAmount)).to.be.true;
        });

        it("Should not allow non-leader to withdraw funds", async function () {
            try {
                await politicalPartyFund.connect(addr1).withdrawFunds(1);
                expect.fail("Should have thrown error");
            } catch (error) {
                expect(error.message).to.include("Only party leader can perform this action");
            }
        });
    });

    describe("Campaigns", function () {
        beforeEach(async function () {
            await politicalPartyFund.registerParty(
                "Test Party",
                "Test Leader",
                "REG123",
                partyLeader.address
            );
            await politicalPartyFund.connect(addr1).registerUser(
                "Campaign Creator",
                "politician"
            );
            await politicalPartyFund.verifyKyc(addr1.address);
        });

        it("Should create a new campaign", async function () {
            const campaignGoal = ethers.utils.parseEther("10.0");
            await politicalPartyFund.connect(addr1).createCampaign(
                "Test Campaign",
                "Test Description",
                campaignGoal,
                30,
                1
            );

            const campaign = await politicalPartyFund.getCampaign(0);
            expect(campaign.name).to.equal("Test Campaign");
            expect(campaign.description).to.equal("Test Description");
            expect(campaign.goal.eq(campaignGoal)).to.be.true;
            expect(campaign.isActive).to.be.true;
            expect(campaign.isFunded).to.be.false;
            expect(campaign.creator).to.equal(addr1.address);
        });

        it("Should not create campaign for inactive party", async function () {
            await politicalPartyFund.togglePartyStatus(1);
            const campaignGoal = ethers.utils.parseEther("10.0");
            
            try {
                await politicalPartyFund.connect(addr1).createCampaign(
                    "Test Campaign",
                    "Test Description",
                    campaignGoal,
                    30,
                    1
                );
                expect.fail("Should have thrown error");
            } catch (error) {
                expect(error.message).to.include("Party not active");
            }
        });

        it("Should not create campaign with invalid duration", async function () {
            const campaignGoal = ethers.utils.parseEther("10.0");
            
            try {
                await politicalPartyFund.connect(addr1).createCampaign(
                    "Test Campaign",
                    "Test Description",
                    campaignGoal,
                    0,
                    1
                );
                expect.fail("Should have thrown error");
            } catch (error) {
                expect(error.message).to.include("Duration must be between 1 and 365 days");
            }

            try {
                await politicalPartyFund.connect(addr1).createCampaign(
                    "Test Campaign",
                    "Test Description",
                    campaignGoal,
                    366,
                    1
                );
                expect.fail("Should have thrown error");
            } catch (error) {
                expect(error.message).to.include("Duration must be between 1 and 365 days");
            }
        });

        it("Should allow funding a campaign and mark as funded when goal reached", async function () {
            const campaignGoal = ethers.utils.parseEther("10.0");
            await politicalPartyFund.connect(addr1).createCampaign(
                "Test Campaign",
                "Test Description",
                campaignGoal,
                30,
                1
            );

            await politicalPartyFund.connect(donor).registerUser(
                "John Doe",
                "donor"
            );
            await politicalPartyFund.verifyKyc(donor.address);

            await politicalPartyFund.connect(donor).fundCampaign(
                0,
                { value: campaignGoal }
            );

            const campaign = await politicalPartyFund.getCampaign(0);
            expect(campaign.raised.eq(campaignGoal)).to.be.true;
            expect(campaign.isFunded).to.be.true;
            expect(campaign.isActive).to.be.false;

            const party = await politicalPartyFund.getParty(1);
            expect(party.totalDonations.eq(campaignGoal)).to.be.true;
        });

        it("Should not allow funding inactive campaign", async function () {
            const campaignGoal = ethers.utils.parseEther("10.0");
            await politicalPartyFund.connect(addr1).createCampaign(
                "Test Campaign",
                "Test Description",
                campaignGoal,
                30,
                1
            );

            await politicalPartyFund.connect(donor).registerUser("John Doe", "donor");
            await politicalPartyFund.verifyKyc(donor.address);
            await politicalPartyFund.connect(donor).fundCampaign(0, { value: campaignGoal });

            try {
                await politicalPartyFund.connect(donor).fundCampaign(
                    0,
                    { value: ethers.utils.parseEther("1.0") }
                );
                expect.fail("Should have thrown error");
            } catch (error) {
                expect(error.message).to.include("Campaign is not active");
            }
        });
    });
}); 