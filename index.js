var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser"); // 1
var app = express();
var cors = require("cors");
var methodOverride = require("method-override");
//var mongo_db="mongodb+srv://tig51007:djawnsgma312!@cluster0.y4he2.mongodb.net/NOVELBACKEND?retryWrites=true&w=majority"
// process.env.MONGO_DB
// DB setting
mongoose.connect(process.env.MONGO_DB); // 1
var db = mongoose.connection; //2

//3
db.once("open", function () {
  console.log("DB connected");
});
//4
db.on("error", function (err) {
  console.log("DB ERROR : ", err);
});

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json()); // 2
app.use(bodyParser.urlencoded({ extended: true })); // 3
app.use(cors());
app.use(methodOverride("_method")); // 2

// Port setting //특수문자 라면 ERROR 메세지 Front end 로
var userSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  novelList: { type: String },
  profile: { type: String, required: true }, //기본이미지 .. img(압축된 이미지) url
  tag: { type: Array },
  logined: { type: Boolean, required: true }, //로그인 햇는지.
  createBy: { type: String, required: true }, //아이디 만든 날짜!
  google: { type: String, unique: true }, //oauth 2.0
  kakao: { type: String, unique: true },
  naver: { type: String, unique: true },
});
var novSchema = mongoose.Schema({
  creator: { type: String, required: true }, // 이걸 userSchema의 name과 조인해야됨 User.name
  title: { type: String, required: true, unique: true }, //제목
  text: { type: String, required: true }, //본문
  comments: { type: String }, //댓글 의 key
  createBy: { type: String, required: true },
  like: { type: Number },
  disLike: { tpye: Number },
  tag: { type: Array },
});
var commentSchema = mongoose.Schema({
  creator: { type: String },
  text: { type: String },
  createBy: { type: Number },
  like: { type: Number },
  disLike: { tpye: Number },
});

var User = mongoose.model("contact", userSchema); // 5
var Detail = mongoose.model("detail", novSchema);
var Comment = mongoose.model("comment", commentSchema);

app.get("/", function (req, res) {
  res.redirect("/contacts");
});
app.get("/contacts", function (req, res) {
  //index페이지에 디비에 있는 내용을 뿌림
  User.find({}, function (err, contacts) {
    if (err) return res.json(err);
    res.render("contacts/index", { contacts: contacts });
  });
});
app.get("/details", function (req, res) {
  //index페이지에 디비에 있는 내용을 뿌림
  Detail.find({}, function (err, details) {
    if (err) return res.json(err);
    res.render("details/index", { details: details, myName: req.params.name });
  });
});

// Contacts - New // 8
app.get("/contacts/new", function (req, res) {
  //new를 new에 보여줌 걍
  res.render("contacts/new");
});
app.get("/details/new/:myName", function (req, res) {
  //new를 new에 보여줌 걍
  res.render(
    "details/new",
    { myName: req.params.myName },
    console.log(req.params.myName)
  );
});
app.get("/details/text", function (req, res) {
  //new를 new에 보여줌 걍
  res.render("details/text");
});

app.get("/details/:myName/:detail._id", function (req, res) {
  //index페이지에 디비에 있는 내용을 뿌림
  Detail.findOne({ _id: req.params.id }, function (err, detail) {
    // 조건에 맞는걸 발견
    if (err) return res.json(err);
    res.render("detail/text", { detail: detail });
  });
});

// Contacts - create // 9
app.post("/contacts", function (req, res) {
  // contacts 액션으로 요청된 내용을 디비에 등록
  User.create(req.body, function (err, contact) {
    if (err) return res.json(err);
    res.redirect("/contacts");
  });
});

app.get("/contacts/:name", function (req, res) {
  User.findOne({ _name: req.params.name }, function (err, contact) {
    // 조건에 맞는걸 발견
    if (err) return res.json(err);
    res.render("contacts/show", { contact: contact });
    console.log(contact);
  });
});
app.post("/details", function (req, res) {
  Detail.create(req.body, function (err, detail) {
    if (err) return res.json(err);
    res.redirect("/details");
  });
});
app.get("/detail", function (req, res) {
  //index페이지에 디비에 있는 내용을 뿌림
  Detail.find({}, function (err, details) {
    if (err) return res.json(err);
    res.render("details/index", { details: details });
  });
});
app.get("/details/:name", function (req, res) {
  //index페이지에 디비에 있는 내용을 뿌림
  Detail.find({}, function (err, details) {
    if (err) return res.json(err);
    res.render("details/index", { details: details, myName: req.params.name });
  });
});

// Contacts - edit // 4
app.get("/contacts/:id/edit", function (req, res) {
  User.findOne({ _id: req.params.id }, function (err, contact) {
    //조건에 맞는걸 편집
    if (err) return res.json(err);
    res.render("contacts/edit", { contact: contact });
  });
});
// Contacts - update // 5
app.put("/contacts/:id", function (req, res) {
  User.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    function (err, contact) {
      //조건에 맞는 id를 업뎃
      if (err) return res.json(err);
      res.redirect("/contacts/" + req.params.id);
    }
  );
});
// Contacts - destroy // 6
app.delete("/contacts/:id", function (req, res) {
  User.deleteOne({ _id: req.params.id }, function (err) {
    if (err) return res.json(err);
    res.redirect("/contacts");
  });
});
app.get("/test", (req, res) => {
  User.find({}, function (err, contacts) {
    if (err) return res.json(err);
    res.json(contacts);
  });
});
var port = 3000;
app.listen(port, function () {
  console.log("server on! http://localhost:" + port);
});
