const express = require('express');
const multer = require('multer');
const { parseCSVFile } = require('../utils/fileParser');
const fs = require('fs');

const router = express.Router();

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Debug: Confirm route registration
console.log('Initializing /api/upload route');

// Handle file upload
router.post('/upload', (req, res) => {
  console.log('Upload route hit');
  res.status(200).send('Upload route is working');
});

  

module.exports = router;
