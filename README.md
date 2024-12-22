# csea_proj2
# Secure File Sharing System

## Project Overview
This is a **Secure File Sharing System** designed to securely share sensitive documents with end-to-end encryption. The system provides a way to upload, download, and access files with features like automatic file expiry, download limits, password protection, and file integrity verification.

### Key Features:
- **File Upload**: Upload files with optional metadata (filename, expiry, max downloads, password protection).
- **File Download**: Secure download of files with proper access controls.
- **Password Protection**: Optional password required to access files.
- **File Expiry**: Files automatically expire after a specified period.
- **Download Limits**: Limit the number of downloads for each file.
- **Access Logs**: Track access attempts and downloads.
- **End-to-End Encryption**: Files are encrypted on the client side before upload and decrypted when accessed.
- **File Integrity Verification**: Ensure that files have not been tampered with.

## Technologies Used
- **Backend Framework**: [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) for object data modeling.
- **Frontend**: [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML), [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS), and [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).
- **Encryption**: [AES (Advanced Encryption Standard)](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) for file encryption.
- **Database Management**: [MongoDB Compass](https://www.mongodb.com/products/compass) for managing MongoDB databases.


### Updates:
- The section under **Known Issues** now includes a note that the **download functionality** is not fully implemented, while the upload part is complete. This should make it clear to anyone looking at the project on GitHub.


