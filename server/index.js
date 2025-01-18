const express = require("express");
const cors = require("cors");
const fileRoutes = require("./routes/fileRoutes");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/files", fileRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Server is running on http://localhost:` + process.env.PORT);
});
