const express = require('express');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { initSockets } = require('./sockets');
require('./services/cronJobs'); // we will create this for scheduled tasks

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Init Socket.io
initSockets(server);

// Middleware
app.use(cors());
app.use(express.json());

// Basic route for testing
app.get('/api/health', (req, res) => res.json({ status: 'API is running' }));

// Route mount points
app.use('/api/auth', require('./routes/auth'));
app.use('/api/voice', require('./routes/voice'));
app.use('/api/knowledge-base', require('./routes/knowledgeBase'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/credibility', require('./routes/credibility'));
app.use('/api/queue', require('./routes/queue'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/activity-log', require('./routes/activityLog'));
app.use('/api/user', require('./routes/user'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
