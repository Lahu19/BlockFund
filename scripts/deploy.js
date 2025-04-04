const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const PoliticalPartyFund = await ethers.getContractFactory("PoliticalPartyFund");
  const politicalPartyFund = await PoliticalPartyFund.deploy();

  await politicalPartyFund.waitForDeployment();

  console.log("PoliticalPartyFund deployed to:", await politicalPartyFund.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 