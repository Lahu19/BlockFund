# Create artifacts directory if it doesn't exist
$artifactsDir = "src/artifacts/contracts/PoliticalPartyFund.sol"
New-Item -ItemType Directory -Force -Path $artifactsDir

# Copy contract artifacts from web3 to client
$sourceFile = "../web3/artifacts/contracts/PoliticalPartyFund.sol/PoliticalPartyFund.json"
$targetFile = "$artifactsDir/PoliticalPartyFund.json"

if (Test-Path $sourceFile) {
    Copy-Item -Path $sourceFile -Destination $targetFile -Force
    Write-Host "Contract artifacts copied successfully!"
} else {
    Write-Host "Error: Contract artifacts not found. Please compile the contracts first."
    Write-Host "Run 'npx hardhat compile' in the web3 directory first."
    exit 1
} 