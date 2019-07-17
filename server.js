const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const fileUpload = require('express-fileupload');

const app = express();
app.use(cors());

const postsDir = 'uploads/posts';

fs.exists(postsDir, exists => {
  if (!exists) {
    fs.mkdir(postsDir, created => {});
  }
});
const galleryDir = 'uploads/gallery';

fs.exists(galleryDir, exists => {
  if (!exists) {
    fs.mkdir(galleryDir, created => {});
  }
});

// Conect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(fileUpload());
// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// set /uploads folder for public access
app.use('/uploads', express.static('uploads'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
