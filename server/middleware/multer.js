const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Absolute path to server/public directory
const uploadDir = path.join(__dirname, "../public");

// Auto-create directory if missing to prevent ENOENT errors
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB Max
});

module.exports = upload;