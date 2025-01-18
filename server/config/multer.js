const multer = require("multer");
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/uploads");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedTypes = [
		"application/pdf",
		"image/jpeg",
		"image/png",
		"image/jpg",
	];
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		return cb(new Error("Only PDFs, JPEGs, and PNGs are allowed"));
	}
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
