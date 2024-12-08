const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./backend/routes/uploadRoutes');
const cleanseRoutes = require('./backend/routes/cleanseRoutes');

const app = express();
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/cleanse', cleanseRoutes);

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, 'frontend/src')));

// Fallback route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/src/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

console.log('Registering /api/upload route');
