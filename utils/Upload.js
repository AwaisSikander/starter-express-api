const multer = require("multer");
const path = require("path");
const {
  USER_PROFILE_IMAGE_DESTINATION,
  USER_WINNER_IMAGE_DESTINATION,
} = require("../config/index");

/** Storage Engine */
const storageEngine = multer.diskStorage({
  destination: USER_PROFILE_IMAGE_DESTINATION,
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

const storageEngineWinnerUpload = multer.diskStorage({
  destination: USER_WINNER_IMAGE_DESTINATION,
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
const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, callback) {
    validateFile(file, callback);
  },
});
//init
const uploadWinnerImages = multer({
  storage: storageEngineWinnerUpload,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, callback) {
    validateFile(file, callback);
  },
});

const Upload = upload.single("profile_pic");
const winnerUpload = uploadWinnerImages.fields([
  { name: "winner_1_image", maxCount: 1 },
  { name: "winner_2_image", maxCount: 1 },
  { name: "winner_3_image", maxCount: 1 },
]);
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

module.exports = { Upload, winnerUpload };
