//jshint esversion:6

// requiring all the node modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// connecting the mongoose to the mongodb using localhost
mongoose.connect(process.env.MONGO_URI).then((c) => {
	console.log(`mongo connected : ${c.connection.host}`);
}).catch(e => {
	console.log(e);
});

// setting port to listen
const port = 3000 || process.env.PORT;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// making the schema of the database
const postSchema = {
  title: String,
  content: String
};

// creating the collection of the database
const post = mongoose.model("post", postSchema);

// home route
app.get("/", function (req, res) {
  // finding the part of the blogs
  post.find({}, function (err, blogs) {
    if (err) console.log(err);
    res.render("home", {
      startingContent: homeStartingContent,
      posts: blogs
    });
  });
});

// about route
app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

// contact route
app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

// compose route
app.get("/compose", function (req, res) {
  res.render("compose");
});

// posting the blog
app.post("/compose", function (req, res) {
  // saving the details of the blog
  const blog = new post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  blog.save(function (err) {
    if (!err) res.redirect("/");
  });
});

// getting the body of the whole blog made
app.get("/posts/:postId", function (req, res) {
  const requestedId = req.params.postId;
  // finding the whole body of the blog
  post.findOne({ _id: requestedId }, function (err, post) {
    if (!err) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });
});

// listening to the port
app.listen(port, function () {
  console.log(`Server started on port.${port}`);
});


//this is a comment we are adding to make a fuddu of heroku