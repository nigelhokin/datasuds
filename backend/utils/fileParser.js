const fs = require('fs');
const Papa = require('papaparse');

/**
 * Reads and parses a CSV file from the specified path.
 * @param {string} filePath - The path to the CSV file.
 * @returns {Object} - An object containing the parsed rows and headers.
 */
function parseCSVFile(filePath) {
  try {
    console.log(`Reading file at: ${filePath}`); // Debug: Log file path

    // Read the file contents
    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log('File read successfully'); // Debug: Log successful read

    // Parse the CSV content
    const parsedData = Papa.parse(fileContent, { header: true });
    console.log('File parsed successfully'); // Debug: Log successful parse

    // Extract headers and rows
    const headers = parsedData.meta.fields || [];
    const rows = parsedData.data || [];

    // Check for missing or invalid headers
    if (headers.length === 0) {
      console.error('No headers found in CSV file'); // Debug: Log missing headers
      throw new Error('The CSV file does not contain valid headers');
    }

    console.log(`Headers extracted: ${headers}`); // Debug: Log headers
    console.log(`Number of rows parsed: ${rows.length}`); // Debug: Log row count

    return { headers, rows };
  } catch (error) {
    console.error(`Error parsing CSV file at ${filePath}:`, error); // Debug: Log file-specific error
    throw new Error(`Failed to parse CSV file: ${error.message}`);
  }
}

module.exports = { parseCSVFile };
