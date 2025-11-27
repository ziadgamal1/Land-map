const express = require("express");
const app = express();
const multer = require("multer");
require("dotenv").config();
const cors = require("cors");
import pkg from "pg";
const { Pool } = pkg;
const {
  pass,
  jwtPass,
  DB_HOST,
  DB_user,
  DB_NAME,
  DB_PORT,
  localDB_host,
  localDB_user,
  localDB_name,
  localDB_pass,
} = process.env;
import jwt from "jsonwebtoken";
app.use(
  cors({
    origin: ["https://land-map-nine.vercel.app", "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Only if you need to send cookies/auth headers
    optionsSuccessStatus: 204, // Standard status for OPTIONS preflight success
  })
);
const db = new Pool({
  host: DB_HOST,
  user: DB_user,
  password: pass,
  port: Number(DB_PORT),
  database: DB_NAME,
  ssl: { rejectUnauthorized: false },
  // optional but recommended for Render
  max: 10,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 0,
});
const upload = multer({
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/json",
      "application/geo+json",
      "application/vnd.geo+json",
    ];

    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JSON or GeoJSON files allowed"));
  },
});
const port = 8080;
app.use(express.urlencoded({ extended: true }));
app.use("/", express.raw({ type: "*/*", limit: "10mb" }));
app.use(
  express.json({
    type: [
      "application/json",
      "application/geo+json",
      "application/vnd.geo+json",
    ],
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.post("/signup", (req, res) => {
  const { userName, password } = JSON.parse(req.body);
  db.query("insert into credentials (userName,password) values ($1,$2)", [
    userName,
    password,
  ])
    .then(() => {
      res.status(200).json({ message: "User signed up successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error signing up user" });
    });
});

app.post("/login", async (req, res) => {
  const { userName, password } = JSON.parse(req.body);
  try {
    const result = await db.query(
      "SELECT * FROM credentials WHERE username = $1 AND password = $2",
      [userName, password]
    );
    console.log(result);
    const rows = result.rows;
    console.log(rows);

    if (rows.length > 0) {
      const payload = {
        userName: rows[0].username,
      };
      // STEP 2: Sign the payload to create the token
      const token = jwt.sign(payload, jwtPass, { expiresIn: "1h" });
      console.log(token);
      return res.status(200).json({ message: "Login successful", token });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
});
// Middleware function to check and decode the token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // Format is "Bearer TOKEN"
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // No token provided

  jwt.verify(token, jwtPass, (err, user) => {
    if (err) return res.sendStatus(403); // Token is invalid or expired
    req.user = user; // Attach the decoded user data (e.g., { id: 1, userName: 'user' })
    next(); // Move on to the route handler
  });
};
let x = 0;
app.post("/form", upload.single("file"), authenticateToken, (req, res) => {
  const buffer = req.body; // <— raw file bytes
  const loggedInUser = req.user.userName;
  const text = buffer.toString("utf8"); // convert to string
  try {
    const geojson = JSON.parse(text);
    const coords = geojson.features.map((f) => f.geometry.coordinates);
    for (const element of coords) {
      for (const point of element[0]) {
        if (point[0] === element[0][0][0] && point[1] === element[0][0][1]) {
          x++;
        }
        db.query(
          "insert into coordinates (username,north, east,x) values ($1,$2, $3,$4)",
          [loggedInUser, point[1], point[0], x]
        );
      }
    }
    res.status(200).send(coords);
  } catch (err) {
    return res.status(400).send("Invalid GeoJSON file");
  }
});
app.get("/dashboard", authenticateToken, async (req, res) => {
  const resultDB = await db.query(
    "select * from coordinates where username=$1 ORDER BY x, created_at ASC",
    [req.user.userName]
  );
  const result = [];
  let currentGroup = [];

  for (const point of resultDB.rows) {
    const arr = [point.north, point.east];

    if (currentGroup.length === 0) {
      // Start a new polygon
      currentGroup.push(arr);
    } else if (currentGroup[0][0] === arr[0] && currentGroup[0][1] === arr[1]) {
      // Found the closing point - complete the polygon
      currentGroup.push(arr);
      result.push(currentGroup);
      currentGroup = [];
    } else {
      // Continue building the current polygon
      currentGroup.push(arr);
    }
  }
  console.log(result);
  // Add any remaining points if the last group didn't end with a duplicate

  if (result.length === 0) {
    res.status(404).json({ message: "No data found" });
    return;
  } else {
    res.status(200).json(result.map((group) => [group]));
  }
});
app.listen(port);
