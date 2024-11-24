const fs = require('fs');
const path = require('path');

// Load .env file
require('dotenv').config();

const environmentFilePath = path.join(__dirname, '../src/environments/environment.ts');
const environmentProdFilePath = path.join(__dirname, '../src/environments/environment.prod.ts');

// Read the environment.ts file template
let environmentFileContent = fs.readFileSync(environmentFilePath, 'utf-8');
let environmentProdFileContent = fs.readFileSync(environmentProdFilePath, 'utf-8');

// Replace placeholders with actual environment variables
environmentFileContent = environmentFileContent.replace(
  /process\.env\.FIREBASE_API_KEY/g,
  `'${process.env.FIREBASE_API_KEY}'`
);
environmentFileContent = environmentFileContent.replace(
  /process\.env\.FIREBASE_AUTH_DOMAIN/g,
  `'${process.env.FIREBASE_AUTH_DOMAIN}'`
);
environmentFileContent = environmentFileContent.replace(
  /process\.env\.FIREBASE_PROJECT_ID/g,
  `'${process.env.FIREBASE_PROJECT_ID}'`
);
environmentFileContent = environmentFileContent.replace(
  /process\.env\.FIREBASE_STORAGE_BUCKET/g,
  `'${process.env.FIREBASE_STORAGE_BUCKET}'`
);
environmentFileContent = environmentFileContent.replace(
  /process\.env\.FIREBASE_MESSAGING_SENDER_ID/g,
  `'${process.env.FIREBASE_MESSAGING_SENDER_ID}'`
);
environmentFileContent = environmentFileContent.replace(
  /process\.env\.FIREBASE_APP_ID/g,
  `'${process.env.FIREBASE_APP_ID}'`
);

// Write the updated content back to the environment.ts and environment.prod.ts files
fs.writeFileSync(environmentFilePath, environmentFileContent, 'utf-8');
fs.writeFileSync(environmentProdFilePath, environmentProdFileContent, 'utf-8');
