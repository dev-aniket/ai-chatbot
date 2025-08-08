require("dotenv").config();
const app = require("./src/app");
const { createServer } = require("http");
const { Server } = require("socket.io");

const generateContent = require("./src/services/ai.service");

// Attach Express app to HTTP server
const httpServer = createServer(app);

const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

const chatHistory = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("ai-message", async (data) => {
    chatHistory.push({
      role: "user",
      parts: [{ text: data }]
    });

    const response = await generateContent(chatHistory);

    chatHistory.push({
      role: "model",
      parts: [{ text: response }]
    });

    socket.emit("ai-message-response", response);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket.io Server is running on port ${PORT}`);
});
