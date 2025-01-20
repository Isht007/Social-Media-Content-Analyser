import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [previewData, setPreviewData] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const handleFileChange = (event) => {
		const files = Array.from(event.target.files);
		setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
		setErrorMessage("");
	};

	const handleDragOver = (event) => {
		event.preventDefault();
		event.stopPropagation();
	};

	const handleDrop = (event) => {
		event.preventDefault();
		event.stopPropagation();

		const files = Array.from(event.dataTransfer.files);
		setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
		setErrorMessage("");
	};

	const handleUpload = async () => {
		if (selectedFiles.length === 0) {
			setErrorMessage("Please select or drag files to upload.");
			return;
		}

		setUploading(true);
		setSuccessMessage("");
		const formData = new FormData();
		selectedFiles.forEach((file) => {
			formData.append("file", file);
		});

		try {
			const response = await axios.post(
				"https://social-media-content-analyser-server.onrender.com",
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			);
			setPreviewData(response.data.results || []);
			setSelectedFiles([]);
			setErrorMessage("");
			setSuccessMessage("Files uploaded successfully!");
		} catch (error) {
			setErrorMessage("File upload failed. Please try again.");
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="app">
			<header className="app-header">
				<h1>Social Media Content Analyzer</h1>
				<p>Upload PDF or image files to extract and view text content.</p>
			</header>
			<main>
				<div className="upload-section">
					<input
						type="file"
						multiple
						onChange={handleFileChange}
						className="file-input"
					/>
					<div
						className="drag-drop-area"
						onDragOver={handleDragOver}
						onDrop={handleDrop}
					>
						{selectedFiles.length > 0 ? (
							<ul className="file-list">
								{selectedFiles.map((file, index) => (
									<li key={index}>{file.name}</li>
								))}
							</ul>
						) : (
							<p>Drag and drop files here, or click "Choose Files"</p>
						)}
					</div>
					<button
						onClick={handleUpload}
						disabled={uploading}
						className="upload-button"
					>
						{uploading ? "Uploading..." : "Upload Files"}
					</button>
				</div>
				{errorMessage && <p className="error-message">{errorMessage}</p>}
				{successMessage && <p className="success-message">{successMessage}</p>}
				<div className="preview-section">
					<h2>Extracted Text Preview</h2>
					{previewData.length > 0 ? (
						previewData.map((file, index) => (
							<div key={index} className="file-preview">
								<h3>{file.filename}</h3>
								<pre>{file.extractedText}</pre>
								{file.error && <p className="error-message">{file.error}</p>}
							</div>
						))
					) : (
						<p>No files available for preview yet.</p>
					)}
				</div>
			</main>
			<footer>
				<p>&copy; 2025 Social Media Content Analyzer. All Rights Reserved.</p>
			</footer>
		</div>
	);
};

export default App;
