const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { parseCSVFile } = require('../utils/fileParser');
const Papa = require('papaparse');
const cleansingRules = require('../utils/cleansingRules/cleansingRules');

const router = express.Router();

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Handle data cleansing
router.post('/cleanse', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const filePath = req.file.path;

    // Parse the file to extract rows
    const { rows } = parseCSVFile(filePath);

    let approvedChanges = [];
    try {
      approvedChanges = JSON.parse(req.body.approvedChanges);
    } catch (error) {
      console.error('Error parsing approved changes:', error);
      return res.status(400).send('Invalid approved changes object');
    }

    // Apply cleansing rules to the rows
    const cleanedData = rows.map((row, rowIndex) => {
      approvedChanges.forEach((change) => {
        if (change.row == rowIndex) {
          const column = change.column;
          const rule = cleansingRules[change.rule];
          if (rule && row[column]) {
            row[column] = rule(row[column]);
          }
        }
      });
      return row;
    });

    // Generate the cleaned file
    const cleanedFilePath = `uploads/cleaned_${req.file.originalname}`;
    fs.writeFileSync(cleanedFilePath, Papa.unparse(cleanedData));

    // Send the cleaned file as a download
    res.download(cleanedFilePath, (err) => {
      if (err) {
        console.error('Error sending cleaned file:', err);
      }
      // Clean up temporary files
      fs.unlinkSync(cleanedFilePath);
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Error processing cleanse request:', error);
    res.status(500).send('Error processing file');
  }
});

module.exports = router;
