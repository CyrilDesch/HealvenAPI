const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

const uri = 'mongodb+srv://admin:admin@cluster0.wmykm.mongodb.net/ReactCourses18484?retryWrites=true&w=majority';
var storage = new GridFsStorage({
  url: uri,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-bezkoder-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: "profileImage",
      filename: `${Date.now()}-bezkoder-${file.originalname}`
    };
  }
});


var uploadFile = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;