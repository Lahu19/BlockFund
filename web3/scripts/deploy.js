const hre = require("hardhat");

async function main() {
  const PoliticalPartyFund = await hre.ethers.getContractFactory("PoliticalPartyFund");
  const politicalPartyFund = await PoliticalPartyFund.deploy();
  await politicalPartyFund.deployed();

  console.log("PoliticalPartyFund deployed to:", politicalPartyFund.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 