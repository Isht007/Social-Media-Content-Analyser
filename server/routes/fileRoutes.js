const express = require("express");
const upload = require("../config/multer");

const processFile = require("../controller/fileController");
const router = express.Router();

router.post("/upload", upload.array("file", 10), processFile);

module.exports = router;
