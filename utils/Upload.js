const multer = require("multer");
const path = require("path");

/** Storage Engine */
const storageEngine = multer.diskStorage({
  destination: "./public/uploads/users/images",
  filename: function (req, file, fn) {
    fn(
      null,
      new Date().getTime().toString() +
        "-" +
        file.fieldname +
        path.extname(file.originalname)
    );
  },
});

//init
const Upload = multer({
  storage: storageEngine,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, callback) {
    validateFile(file, callback);
  },
}).single("profile_pic");

var validateFile = function (file, cb) {
  allowedFileTypes = /jpeg|jpg|png|gif/;
  const extension = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.");
  }
};

module.exports = Upload;
