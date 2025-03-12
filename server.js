const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.static("uploads"));

// Set up storage for uploaded images
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, "latest.jpg"); // Always overwrite with the latest image
    }
});
const upload = multer({ storage });

// Handle photo uploads
app.post("/upload", upload.single("photo"), (req, res) => {
    console.log("📸 New photo uploaded!");

    // Notify all connected clients about the new photo
    io.emit("newPhoto", { imageUrl: "/latest.jpg" });

    res.json({ success: true, imageUrl: "/latest.jpg" });
});

// Serve the latest image
app.get("/latest.jpg", (req, res) => {
    res.sendFile(path.join(__dirname, "uploads/latest.jpg"));
});

// Start the server
server.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));