const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize MongoDB Connection
connectDB();

const app = express();

// Express Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Mount API routes (matching NEXT_PUBLIC_API_URL: http://localhost:5000/api/v1)
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/resumes', require('./routes/resumes'));
app.use('/api/v1/jobs', require('./routes/jobs'));
app.use('/api/v1/ai', require('./routes/ai'));
app.use('/api/v1/applications', require('./routes/applications'));

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'ResumeForge MERN API',
    version: '1.0.0'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
