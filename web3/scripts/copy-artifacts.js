const fs = require('fs');
const path = require('path');

// Paths
const artifactsDir = path.join(__dirname, '../artifacts/contracts/CrowdFunding.sol');
const clientArtifactsDir = path.join(__dirname, '../../client/src/artifacts/contracts/CrowdFunding.sol');

// Create client artifacts directory if it doesn't exist
if (!fs.existsSync(clientArtifactsDir)) {
  fs.mkdirSync(clientArtifactsDir, { recursive: true });
}

// Copy CrowdFunding.json
const sourceFile = path.join(artifactsDir, 'CrowdFunding.json');
const targetFile = path.join(clientArtifactsDir, 'CrowdFunding.json');

try {
  fs.copyFileSync(sourceFile, targetFile);
  console.log('Contract artifacts copied successfully!');
} catch (error) {
  console.error('Error copying contract artifacts:', error);
} 