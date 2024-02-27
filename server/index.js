const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
var cookieParser = require("cookie-parser");
const UserModel = require("./models/User");

const fs = require("fs");
const PostModel = require("./models/Post");
const port = 4000;
const salt = 10;
const uploadMiddleware = multer({ dest: "uploads/" });
const secret = "jh2132hj32hbhghiu98sldkl989";
const app = express();
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
mongoose
  .connect(
    "mongodb+srv://bharatinternuser:jGN8jdd1DmJ3lA8M@bharatinterncluster.ydbol4i.mongodb.net/?retryWrites=true&w=majority&appName=bharatinterncluster"
  )
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => console.error(err));
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  try {
    const userDoc = await UserModel.create({
      username,
      email,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await UserModel.findOne({ username });
  const passok = bcrypt.compareSync(password, userDoc.password);
  // res.json(passok);
  if (passok) {
    //login
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      // res.json(token);
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong  password or email");
  }
});
app.listen(port, (req, res) => {
  console.log(`Server us listening on port ${port}`);
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const extention = parts[parts.length - 1];
  const newPath = path + "." + extention;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await PostModel.create({
      title,
      summary,
      content,
      cover: newPath,
      auther: info.id,
    });
    res.json({ postDoc });
  });
});
app.get("/post", async (req, res) => {
  const posts = await PostModel.find()
    .populate("auther", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});
app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await PostModel.findById(id).populate("auther", ["username"]);
  res.json(postDoc);
});
app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  // res.json(req.file);
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const extention = parts[parts.length - 1];
    newPath = path + "." + extention;
    fs.renameSync(path, newPath);
  }
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await PostModel.findById(id);
    const isAuther = JSON.stringify(postDoc.auther) === JSON.stringify(info.id);
    res.json({ isAuther, postDoc, info });
    if (!isAuther) {
      return res.status(400).json("your are not the Auther");
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });
    res.json({ postDoc });
  });
});
//mongodb+srv://bharatinternuser:jGN8jdd1DmJ3lA8M@bharatinterncluster.ydbol4i.mongodb.net/?retryWrites=true&w=majority
