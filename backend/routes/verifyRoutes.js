const express = require('express');
const bcrypt = require('bcryptjs');
const File = require('../models/File');
const router = express.Router();


router.post('/verify/:fileId', async (req, res) => {
  const { password } = req.body;
  const file = await File.findById(req.params.fileId);

  if (!file || (file.password_hash && !password)) {
    return res.status(404).json({ message: 'File not found or password required' });
  }

  if (file.password_hash && !(await bcrypt.compare(password, file.password_hash))) {
    return res.status(400).json({ message: 'Incorrect password' });
  }

  res.json({ message: 'File access verified' });
});

module.exports = router;
