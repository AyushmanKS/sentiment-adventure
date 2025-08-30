const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// --- Load environment variables FIRST ---
dotenv.config();

const app = express();

// --- Apply middleware SECOND ---
app.use(cors());
app.use(express.json());

// --- Define routes THIRD ---
const progressRoutes = require('./routes/progressRoutes');
const contentRoutes = require('./routes/contentRoutes');

app.use('/api/progress', progressRoutes);
app.use('/api/content', contentRoutes);

// --- Simple health check route ---
app.get('/', (req, res) => {
  res.send('Sentiment Adventure API is running!');
});

// --- Connect to database FOURTH ---
connectDB();

// --- Start the server LAST ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));