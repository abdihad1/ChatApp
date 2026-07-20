const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Open login.html when visiting the website
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});