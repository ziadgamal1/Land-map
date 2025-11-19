const express = require("express");
const app = express();
const multer = require("multer");
import mysql from "mysql2/promise";
import { pass } from "./password.js";
import { use } from "react";
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
  console.log(userName, password);
  db.query("insert into credentials (userName,password) values (?,?)", [
    userName,
    password,
  ])
    .then(() => {
      res.status(200).send("User signed up successfully");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error signing up user");
    });
});
app.post("/form", upload.single("file"), (req, res) => {
  const buffer = req.body; // <— raw file bytes

  const text = buffer.toString("utf8"); // convert to string
  try {
    const geojson = JSON.parse(text);
    const coords = geojson.features.map((f) => f.geometry.coordinates);
    for (const element of coords) {
      for (const point of element[0]) {
        db.query("insert into coordinates (north, east) values (?, ?)", [
          point[1],
          point[0],
        ]);
      }
    }
    res.status(200).send(coords);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Invalid GeoJSON file");
  }
});

app.listen(port);
