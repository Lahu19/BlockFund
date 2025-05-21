# Get the current directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$clientArtifactsPath = Join-Path $scriptPath "client/src/artifacts/contracts/PoliticalPartyFund.sol"
$web3ArtifactsPath = Join-Path $scriptPath "web3/artifacts/contracts/PoliticalPartyFund.sol/PoliticalPartyFund.json"

Write-Host "Checking for contract artifacts..."
Write-Host "Looking in: $web3ArtifactsPath"

# Create directory structure
if (-not (Test-Path $clientArtifactsPath)) {
    Write-Host "Creating artifacts directory..."
    New-Item -ItemType Directory -Force -Path $clientArtifactsPath | Out-Null
}

# Check if source file exists
if (Test-Path $web3ArtifactsPath) {
    Write-Host "Found contract artifacts, copying..."
    # Copy the contract artifacts
    Copy-Item $web3ArtifactsPath -Destination "$clientArtifactsPath/PoliticalPartyFund.json" -Force
    Write-Host "Contract artifacts copied successfully!"
} else {
    Write-Host "Error: Contract artifacts not found at: $web3ArtifactsPath"
    Write-Host "Please make sure you have compiled the contracts first by running:"
    Write-Host "cd web3 && npx hardhat compile"
    exit 1
} 