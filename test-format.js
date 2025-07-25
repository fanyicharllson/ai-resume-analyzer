// Simple test script for the formatSize function
// This is just for verification and won't be part of the final codebase

const formatSize = (bytes) => {
  // Handle edge cases
  if (bytes === 0) return '0 Bytes';
  if (bytes < 0) return 'Invalid size';

  // Define units and the base for conversion
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const base = 1024;
  
  // Calculate the appropriate unit
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));
  
  // Ensure we don't exceed available units
  const finalUnitIndex = Math.min(unitIndex, units.length - 1);
  
  // Calculate the value in the selected unit and format to 2 decimal places
  const value = bytes / Math.pow(base, finalUnitIndex);
  
  // Format the result: round to 2 decimal places and remove trailing zeros
  return `${value.toFixed(2).replace(/\.0+$|(\.\d*[1-9])0+$/, '$1')} ${units[finalUnitIndex]}`;
};

// Test cases
console.log('Testing formatSize function:');
console.log('0 bytes:', formatSize(0));
console.log('Negative bytes:', formatSize(-100));
console.log('500 bytes:', formatSize(500));
console.log('1023 bytes:', formatSize(1023));
console.log('1024 bytes (1KB):', formatSize(1024));
console.log('1536 bytes (1.5KB):', formatSize(1536));
console.log('1048576 bytes (1MB):', formatSize(1048576));
console.log('1572864 bytes (1.5MB):', formatSize(1572864));
console.log('1073741824 bytes (1GB):', formatSize(1073741824));
console.log('20MB (max file size):', formatSize(20 * 1024 * 1024));