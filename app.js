const express = require('express');
const cors = require('cors');
const path = require('path');
const uploadRoutes = require('./backend/routes/uploadRoutes');
const cleanseRoutes = require('./backend/routes/cleanseRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/cleanse', cleanseRoutes);

// Serve static files after API routes
app.use(express.static(path.join(__dirname, 'frontend/src')));

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/src/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
