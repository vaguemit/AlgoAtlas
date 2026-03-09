const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Directories to exclude
const excludeDirs = [
  'node_modules',
  '.next',
  'out',
  'dist',
  '.git',
  'scripts',
  'public'
];

// File extensions to process
const includeExtensions = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx'
];

// Regex to find console.log statements
const consoleLogRegex = /console\.log\s*\((?:[^)(]|\([^)(]*\))*\);?/g;

// Function to recursively get all files
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    if (excludeDirs.includes(subdir)) return [];
    
    const stats = await stat(res);
    if (stats.isDirectory()) {
      return getFiles(res);
    } else if (stats.isFile() && includeExtensions.includes(path.extname(res))) {
      return res;
    }
    return [];
  }));
  
  return files.flat();
}

// Function to replace console.log in a file
async function removeConsoleLogsFromFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    
    // Check if file contains console.log
    if (!consoleLogRegex.test(content)) {
      return {
        filePath,
        modified: false,
        count: 0
      };
    }
    
    // Reset regex lastIndex
    consoleLogRegex.lastIndex = 0;
    
    // Replace all console.log statements with empty string
    let newContent = content;
    const matches = content.match(consoleLogRegex) || [];
    
    if (matches.length > 0) {
      newContent = content.replace(consoleLogRegex, '/* console.log removed */');
      await writeFile(filePath, newContent, 'utf8');
      
      return {
        filePath,
        modified: true,
        count: matches.length
      };
    }
    
    return {
      filePath,
      modified: false,
      count: 0
    };
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return {
      filePath,
      error: error.message
    };
  }
}

async function main() {
  console.log('Scanning for files with console.log statements...');
  
  try {
    const files = await getFiles('.');
    console.log(`Found ${files.length} files to scan.`);
    
    let modifiedCount = 0;
    let totalRemoved = 0;
    
    for (const file of files) {
      const result = await removeConsoleLogsFromFile(file);
      
      if (result.modified) {
        modifiedCount++;
        totalRemoved += result.count;
        console.log(`Removed ${result.count} console.log(s) from ${result.filePath}`);
      }
    }
    
    console.log('--------------------------------------');
    console.log(`Processed ${files.length} files.`);
    console.log(`Modified ${modifiedCount} files.`);
    console.log(`Removed ${totalRemoved} console.log statements in total.`);
    console.log('--------------------------------------');
    
    if (modifiedCount === 0) {
      console.log('No console.log statements were found or removed.');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main(); 