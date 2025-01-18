const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");
const pdf = require("pdf-parse");

const processFile = async (file) => {
	let filename = fs.readFileSync(file.path);
	let extension = path.extname(file.originalname);

	let extractedText = "";

	if (extension === ".jpeg" || extension === ".png" || extension === ".jpg") {
		try {
			const result = await Tesseract.recognize(filename);
			console.log(result.data.text);
			extractedText = result.data.text;
			if (!extractedText.trim()) {
				throw new Error(
					`No text content extracted from the file: ${file.originalname}`
				);
			}
		} catch (err) {
			console.log(err);
		}
	} else if (extension === ".pdf") {
		try {
			const data = await pdf(filename);
			extractedText = data.text;
			if (!extractedText.trim()) {
				throw new Error(
					`No text content extracted from the file: ${file.originalname}`
				);
			}
		} catch (err) {
			console.log(err);
		}
	} else {
		throw new Error(
			`Unsupported file format: ${file.originalname}. Only PDFs, JPEGs, JPGs , and PNGs are supported.`
		);
	}

	return { extractedText, fileType: extension == ".pdf" ? "pdf" : "image" };
};

const uploadFiles = async (req, res) => {
	try {
		const files = req.files;
		const outputBaseDir = path.join(__dirname, "../output");
		const results = [];

		const pdfOutputDir = path.join(outputBaseDir, "extractedTextPdf");
		const imageOutputDir = path.join(outputBaseDir, "extractedTextImage");

		if (!fs.existsSync(pdfOutputDir)) {
			fs.mkdirSync(pdfOutputDir, { recursive: true });
		}
		if (!fs.existsSync(imageOutputDir)) {
			fs.mkdirSync(imageOutputDir, { recursive: true });
		}

		for (const file of files) {
			try {
				const { extractedText, fileType } = await processFile(file);

				const outputDir = fileType === "pdf" ? pdfOutputDir : imageOutputDir;
				const outputPath = path.join(
					outputDir,
					`${path.basename(file.filename)}.txt`
				);

				results.push({
					filename: file.filename,
					extractedText,
					fileType,
				});

				fs.writeFileSync(outputPath, extractedText, "utf8");
			} catch (error) {
				return res.status(400).json({ error: error.message });
			}
		}
		res.status(200).json({
			message: "Files uploaded successfully",
			results: results,
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

module.exports = uploadFiles;
