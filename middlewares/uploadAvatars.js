import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("temp"));
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);

    const filename = `avatar_${req.user.id}${extname}`;

    cb(null, filename);
  },
});

export default multer({ storage });
