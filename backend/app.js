const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
import mysql from "mysql2/promise";
import { pass, jwtPass } from "./password.js";
import jwt from "jsonwebtoken";
app.use(cors({ origin: "http://localhost:3000" }));
export const db = mysql.createPool({
  host: "127.0.0.1",
  user: "Ziad",
  password: pass,
  database: "landmap",
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
  db.query("insert into credentials (userName,password) values (?,?)", [
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
    const [rows] = await db.query(
      "SELECT * FROM credentials WHERE userName = ? AND password = ?",
      [userName, password]
    );

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
app.post("/form", upload.single("file"), authenticateToken, (req, res) => {
  const buffer = req.body; // <— raw file bytes
  const loggedInUser = req.user.userName;
  const text = buffer.toString("utf8"); // convert to string
  try {
    const geojson = JSON.parse(text);
    const coords = geojson.features.map((f) => f.geometry.coordinates);
    let x = 0;
    for (const element of coords) {
      for (const point of element[0]) {
        if (point[0] === element[0][0][0] && point[1] === element[0][0][1]) {
          x++;
        }
        db.query(
          "insert into coordinates (username,north, east,x) values (?,?, ?,?)",
          [loggedInUser, point[1], point[0], x]
        );
      }
    }
    res.status(200).send(coords);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Invalid GeoJSON file");
  }
});
app.get("/dashboard", authenticateToken, (req, res) => {});
app.listen(port);
