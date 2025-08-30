const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const progressRoutes = require('./routes/progressRoutes');
const contentRoutes = require('./routes/contentRoutes'); // <-- Ensure this import is here

dotenv.config(); // <--- THIS MUST BE CALLED EARLY

const app = express();
app.use(cors());
app.use(express.json());

// Ensure all routes are used
app.use('/api/progress', progressRoutes);
app.use('/api/content', contentRoutes); // <-- Ensure this line is present

// Connect to DB after dotenv is loaded
connectDB(); // <--- THIS IS CALLED AFTER dotenv.config()

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));