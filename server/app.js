const express = require("express");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");

const goals = require("./data/goals");
const fundamentals = require("./data/fundamentals");
const javascriptFundamentals = require("./data/javascript-fundamentals");
const reactFundamentals = require("./data/react-fundamentals");
const typescriptFundamentals = require("./data/typescript-fundamentals");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/goals", (_, res) => {
  res.status(200).json(goals);
});

app.get("/fundamentals", (_, res) => {
  res.status(200).json(fundamentals);
});

app.get("/javascript-fundamentals", (_, res) => {
  res.status(200).json(javascriptFundamentals);
});

app.get("/react-fundamentals", (_, res) => {
  res.status(200).json(reactFundamentals);
});

app.get("/typescript-fundamentals", (_, res) => {
  res.status(200).json(typescriptFundamentals);
});

app.post("/add-fundamental", (req, res) => {
  const {title, blocks} = req.body;

  if (!title || !blocks || !Array.isArray(blocks)) {
    return res.status(400).send("All fields are required.");
  }

  const newFundamentals = {title, blocks};

  fundamentals.push(newFundamentals);

  // Emit an event to all connected clients to update their block list
  console.log("Emitting update event with data:", fundamentals);
  io.emit("updateFundamentals", fundamentals);

  res.status(201).send("Fundamental added successfully.");
});

app.post("/add-javascript-fundamental", (_, res) => {
  const {title, blocks} = req.body;

  if (!title || !blocks || !Array.isArray(blocks)) {
    return res.status(400).send("All fields are required");
  }

  const newJavascriptFundamentals = (title, blocks);

  javascriptFundamentals.push(newJavascriptFundamentals);

  console.log("Emitting update event with data:", javascriptFundamentals);
  io.emit("updateJavascriptFundamentals", javascriptFundamentals);

  res.status(201).send("JavaScript Funamental added successfully");
});

app.post("/add-react-fundamental", (_, res) => {
  const {title, blocks} = req.body;

  if (!title || !blocks || !Array.isArray(blocks)) {
    return res.status(400).send("All fields are required");
  }

  const newReactFundamentals = {title, blocks};

  reactFundamentals.push(newReactFundamentals);

  console.log("Emitting update event with data:", reactFundamentals);
  io.emit("updateReactFundamentals", reactFundamentals);

  res.status(201).send("React Fundamental added successfully");
});

app.post("/add-typescript-fundamental", (_, res) => {
  const {title, blocks} = req.body;

  if (!title || !blocks || !Array.isArray(blocks)) {
    return res.status(400).send("All fields are required");
  }

  const newTypescriptFundamentals = {title, blocks};

  typescriptFundamentals.push(newTypescriptFundamentals);

  console.log("Emitting update event with data:", typescriptFundamentals);
  io.emit("updateTypescriptundamentals", typescriptFundamentals);

  res.status(201).send("TypeScript Fundamental added successfully");
});

app.post("/add-goals", (req, res) => {
  const {goal, target, current, unit} = req.body;

  if (!goal || !target || !current) {
    return res.status(400).send("All fields are required.");
  }

  const newGoal = {goal, target, current};

  if (unit) {
    newGoal.unit = unit;
  }

  goals.push(newGoal);

  // Emit an event to all connected clients to update their block list
  console.log("Emitting update event with data:", goals);
  io.emit("updateGoals", goals);

  res.status(201).send("Goals section added successfully.");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.emit("initialData", {
    goals,
    fundamentals,
    javascriptFundamentals,
    reactFundamentals,
    typescriptFundamentals,
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
