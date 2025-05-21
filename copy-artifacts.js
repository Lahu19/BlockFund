const fs = require('fs-extra');
const path = require('path');

async function copyArtifacts() {
  try {
    // Source and destination paths
    const sourceDir = path.join(__dirname, 'web3/artifacts/contracts');
    const destDir = path.join(__dirname, 'client/src/artifacts/contracts');

    // Ensure the destination directory exists
    await fs.ensureDir(destDir);

    // Copy the artifacts
    await fs.copy(sourceDir, destDir, {
      filter: (src) => {
        // Only copy .json files and directories
        return fs.statSync(src).isDirectory() || path.extname(src) === '.json';
      }
    });

    console.log('Contract artifacts copied successfully!');
  } catch (error) {
    console.error('Error copying artifacts:', error);
    process.exit(1);
  }
}

copyArtifacts(); 