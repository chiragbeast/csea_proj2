const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const File = require('../models/File');
const authenticate = require('./authMiddleware');
const AccessLog = require('../models/AccessLog');
const fs = require('fs'); // For reading files from the file system
const path = require('path'); // For resolving file paths
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const upload = multer({ storage: multer.memoryStorage() });  // Store files in memory


function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
      const decoded = jwt.verify(token, 'your-secret-key'); // Replace with your secret key
      req.user = decoded; // Store user info in the request object
      next(); // Proceed to the next middleware or route handler
  } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

router.delete('delete/:fileId', authenticate , async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // If you need to check if the user is authorized to delete the file
    if (file.user_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this file' });
    }

    // Delete the file
    await file.deleteOne();

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
});
router.post('/upload', authenticate , upload.single('file'), async (req, res) => {
  const { filename, expiry, maxDownloads, password } = req.body;
  const encryptedFile = req.file.buffer;

  const password_hash = password ? await bcrypt.hash(password, 10) : null;
  const expiryDate = expiry ? new Date(Date.now() + parseDuration(expiry)) : null;

  const file = new File({
    user_id: req.user.userId,
    filename,
    encrypted_file: encryptedFile,
    password_hash,
    expiry: expiryDate,
    max_downloads: maxDownloads
  });

  await file.save();
  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    fileId: file._id
  });
});
const { GridFSBucket } = require('mongodb');


let gfs;
mongoose.connection.once('open', () => {
    const db = mongoose.connection.db;
    gfs = new GridFSBucket(db, { bucketName: 'files' });
});
router.get('/download/:fileId', async (req, res) => {
  try {
    
    const file = await File.findById(req.params.fileId);

    if (!file) {
      console.log("File not found with ID:", req.params.fileId);
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.expiry && file.expiry < Date.now()) {
      console.log("File expired:", file.filename);
      return res.status(400).json({ message: 'File has expired' });
    }
    if (file.downloads_left <= 0) {
      console.log("Download limit reached for file:", file.filename);
      return res.status(400).json({ message: 'Download limit reached' });
    }
    
    if (!file.filename) {
      console.log("Filename is missing in the file object");
      return res.status(400).json({ message: 'Filename is missing for the file' });
    }
    file.downloads_left -= 1;
    await file.save();
    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);

    if (file.data) {
      console.log("Serving file from database...");
      res.send(file.data);
    } else {
      const filePath = path.resolve(__dirname, 'uploads', file.filename);
      console.log("Checking file path:", filePath);

      if (fs.existsSync(filePath)) {
        console.log("Sending file from file system...");
        res.sendFile(filePath);
      } else {
        console.log("File not found on server at path:", filePath);
        return res.status(404).json({ message: 'File not found on server' });
      }
    }
  } catch (error) {
    console.error('Error during file download:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.put('update/:fileId', async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    if (file.user_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this file' });
    }
    const { filename, expiry, maxDownloads, password } = req.body;
    if (filename) {
      file.filename = filename;
    }
    if (expiry) {
      file.expiry = new Date(Date.now() + parseDuration(expiry));  // Use your existing parseDuration function
    }
    if (maxDownloads !== undefined) {
      file.max_downloads = maxDownloads;
    }

    if (password) {
      const password_hash = await bcrypt.hash(password, 10);
      file.password_hash = password_hash;
    }

    // Save the updated file
    await file.save();

    // Send a success response
    res.status(200).json({ message: 'File updated successfully', fileId: file._id });

  } catch (error) {
    res.status(500).json({ message: 'Error updating file', error: error.message });
  }
});

const parseDuration = (duration) => {
  const match = duration.match(/^(\d+)(h|d)$/);
  if (!match) return 0;
  const value = parseInt(match[1], 10);
  return match[2] === 'h' ? value * 3600000 : value * 86400000;
};
module.exports = router;
