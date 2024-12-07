const express = require('express');
const multer = require('multer');
const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');
const cleansingRules = require('./cleansingRules');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Parse CSV and return headers
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    const parsedData = Papa.parse(fileContent, { header: true });
    const headers = Object.keys(parsedData.data[0]);
    console.log('CSV Headers:', headers);
    res.json({ headers });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file');
  } finally {
    if (req.file && req.file.path) fs.unlinkSync(req.file.path);
  }
});

// Generate a preview of changes
app.post('/preview', upload.single('file'), (req, res) => {
  try {
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    const parsedData = Papa.parse(fileContent, { header: true });

    let rules = {};
    try {
      rules = JSON.parse(req.body.rules);
      if (!rules || typeof rules !== 'object') {
        throw new Error('Invalid rules format');
      }
      console.log('Parsed rules:', rules); // Debugging
    } catch (err) {
      console.error('Error parsing rules:', err);
      return res.status(400).send('Invalid rules object');
    }

    const previewData = parsedData.data.map((row) => {
      const previewRow = { ...row }; // Copy the original row
      for (const [column, rule] of Object.entries(rules)) {
        const value = row[column];
        if (!value || !cleansingRules[rule]) continue;

        previewRow[column] = cleansingRules[rule](value); // Apply the rule
      }
      return { original: row, preview: previewRow };
    });

    res.json(previewData); // Send back the original and preview data
  } catch (error) {
    console.error('Error generating preview:', error);
    res.status(500).send('Error generating preview');
  } finally {
    if (req.file && req.file.path) fs.unlinkSync(req.file.path);
  }
});

// Apply final cleansing and download the file
app.post('/cleanse', upload.single('file'), (req, res) => {
  try {
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    const parsedData = Papa.parse(fileContent, { header: true });

    let approvedChanges = [];
    try {
      approvedChanges = JSON.parse(req.body.approvedChanges);
      console.log('Approved changes:', approvedChanges);
    } catch (err) {
      console.error('Error parsing approved changes:', err);
      return res.status(400).send('Invalid approved changes object');
    }

    const cleanedData = parsedData.data.map((row, rowIndex) => {
      approvedChanges.forEach((change) => {
        if (change.row == rowIndex) {
          const column = change.column;
          if (row[column]) {
            row[column] = cleansingRules[change.rule](row[column]);
          }
        }
      });
      return row;
    });

    const cleanedFilePath = `uploads/cleaned_${req.file.originalname}`;
    fs.writeFileSync(cleanedFilePath, Papa.unparse(cleanedData));
    res.download(cleanedFilePath);
  } catch (error) {
    console.error('Error cleansing file:', error);
    res.status(500).send('Error processing file');
  } finally {
    if (req.file && req.file.path) fs.unlinkSync(req.file.path);
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
