const express = require("express");
const mongoose = require("mongoose");
const shortUrl = require("./models/shortUrl");
const ShortUrl = require("./models/shortUrl");

const app = express();

const PORT = process.env.PORT || 3000;

// DB configuration
const db = require("./config/dbUrl").mongoURL;

// DB connect
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("mongoDB connected successfully..."))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

// routes
app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);
  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});

app.listen(PORT, () => console.log(`server is running at ${PORT}`));
