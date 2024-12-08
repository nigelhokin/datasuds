const express = require('express');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const cleansingRules = require('../utils/cleansingRules/cleansingRules');

const router = express.Router();

router.post('/', (req, res) => {
  try {
    const { headers, rows, rules } = req.body;

    if (!headers || !rows || !rules) {
      return res.status(400).json({ error: 'Missing required fields: headers, rows, or rules' });
    }

    console.log('Received headers:', headers);
    console.log('Received rules:', rules);
    console.log('Received rows:', rows);

    // Check available cleansing rules
    console.log('Available cleansing rules:', Object.keys(cleansingRules));

    // Apply cleansing rules to the rows
    const cleanedRows = rows.map((row) => {
      const updatedRow = { ...row }; // Clone the original row

      Object.keys(rules).forEach((column) => {
        const ruleName = rules[column];
        const ruleFunction = cleansingRules[ruleName];

        if (ruleFunction && updatedRow[column]) {
          console.log(`Applying rule "${ruleName}" to column "${column}" with value "${updatedRow[column]}"`);
          updatedRow[column] = ruleFunction(updatedRow[column]);
        } else {
          console.warn(`Rule "${ruleName}" for column "${column}" not found or value is empty`);
        }
      });

      return updatedRow;
    });

    console.log('Cleansed rows:', cleanedRows);

    // Prepare data for CSV export
    const csvData = Papa.unparse({
      fields: headers, // Add headers explicitly
      data: cleanedRows.map((row) =>
        headers.map((header) => row[header] || '') // Ensure column order matches headers
      ),
    });

    console.log('Generated CSV:', csvData);

    // Save the CSV file temporarily
    const cleanedFilePath = path.join(__dirname, `../../uploads/cleaned_data_${Date.now()}.csv`);
    fs.writeFileSync(cleanedFilePath, csvData);

    // Send the cleaned file as a download
    res.download(cleanedFilePath, (err) => {
      if (err) {
        console.error('Error sending cleaned file:', err);
      }
      // Clean up temporary files
      fs.unlinkSync(cleanedFilePath);
    });
  } catch (error) {
    console.error('Error processing cleanse request:', error);
    res.status(500).json({ error: 'Error applying cleansing rules' });
  }
});

module.exports = router;
