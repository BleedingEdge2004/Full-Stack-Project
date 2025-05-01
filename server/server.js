require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

// importing route files from differnet folders
const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const salesRoutes = require('./routes/salesRoutes');
const cors = require('cors');
const dashboardRoutes = require('./routes/dashboardRoutes');
const dummyDataRoutes = require('./routes/dummyDataRoutes');
const setupSalesMonitoringJob = require('./Scheduler');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/sales', dummyDataRoutes);

setupSalesMonitoringJob();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
