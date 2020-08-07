require("dotenv").config();
const express = require("express");
const cloudinary = require("cloudinary");
const formData = require("express-form-data");
const cors = require("cors");
const {
  CLIENT_ORIGIN,
  _COMMENTS,
  _IMAGES,
  _APPROVED,
  _REJECTED
} = require("./config");
const redis = require("redis");
const bluebird = require("bluebird");
const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

client.on("error", function(error) {
  console.error(error);
});

client.on("connect", function() {
  console.log("connected to redis");
});

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use(formData.parse());

app.get("/get-images", async (req, res) => {
  const length = await client.llenAsync(_IMAGES);
  client.lrange(_IMAGES, 0, length, (err, rep) => {
    const images = [];

    if (err) console.log(err);
    rep.forEach(reply => {
      images.push(reply);
    });

    return res.json(images);
  });
});

app.get("/get-comments", async (req, res) => {
  const length = await client.llenAsync(_COMMENTS);
  client.lrange(_COMMENTS, 0, length, (err, rep) => {
    const comments = [];

    if (err) console.log(err);
    rep.forEach(reply => {
      comments.push(reply);
    });

    return res.json(comments);
  });
});

app.get("/get-approved", async (req, res) => {
  const length = await client.llenAsync(_APPROVED);
  client.lrange(_APPROVED, 0, length, (err, rep) => {
    const approved = [];

    if (err) console.log(err);
    rep.forEach(reply => {
      approved.push(reply);
    });

    return res.json(approved);
  });
});

app.get("/get-rejected", async (req, res) => {
  const length = await client.llenAsync(_REJECTED);
  client.lrange(_REJECTED, 0, length, (err, rep) => {
    const rejected = [];

    if (err) console.log(err);
    rep.forEach(reply => {
      rejected.push(reply);
    });

    return res.json(rejected);
  });
});

app.post("/image-upload", (req, res) => {
  const values = Object.values(req.files);
  const promises = values.map(image => cloudinary.uploader.upload(image.path));

  Promise.all(promises).then(results => {
    results.map(result => client.rpush(_IMAGES, result.secure_url));
    return res.json(results);
  });
});

app.post("/submit-comment", (req, res) => {
  const user = Object.keys(req.body)[0];
  const comment = req.body[user];
  const string = user + ": " + comment;
  client.rpush(_COMMENTS, string);
  return res.json([]);
});

app.post("/make-choice", (req, res) => {
  const approved = Object.keys(req.body)[0];
  const url = req.body[approved];
  console.log(approved, url);
  if (approved === "true") {
    console.log("hello");
    client.rpushAsync(_APPROVED, url);
  } else {
    console.log("bye");
    client.rpushAsync(_REJECTED, url);
  }

  return res.json([]);
});

app.post("/delete-picture", (req, res) => {});

app.listen(process.env.PORT || 8080, () => console.log("👍"));
