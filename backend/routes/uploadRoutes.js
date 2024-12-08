const express = require('express');
const multer = require('multer');
const { parseCSVFile } = require('../utils/fileParser');
const fs = require('fs');

const router = express.Router();

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

console.log('Initializing /api/upload route');

router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const parsedData = parseCSVFile(filePath); // Extract headers and rows
    const { headers, rows } = parsedData;

    fs.unlinkSync(filePath); // Clean up uploaded file

    // Send headers and rows to the frontend
    res.json({ headers, rows });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Error processing file upload' });
  }
});


router.post('/test', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  console.log('File uploaded successfully:', req.file);
  res.send(`File uploaded: ${req.file.originalname}`);
});

module.exports = router;
