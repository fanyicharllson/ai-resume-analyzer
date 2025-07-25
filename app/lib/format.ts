/**
 * Formats a file size in bytes to a human-readable string (KB, MB, GB)
 * @param bytes - The size in bytes
 * @returns A formatted string representing the size
 */
export function formatSize(bytes: number): string {
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
}