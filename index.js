var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser"); // 1
var app = express();
var cors = require("cors");
var methodOverride = require("method-override");
var mongo_db="mongodb+srv://tig51007:djawnsgma312!@cluster0.y4he2.mongodb.net/NOVELBACKEND?retryWrites=true&w=majority"
// process.env.MONGO_DB
// DB setting
mongoose.connect(mongo_db); // 1
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
  name: { type: String, required: true, unique: true }, //이거 까지.
  email: { type: String, required: true }, //이거
  password: { type: String, required: true }, //이거
  novelList: { type: String },
  profile: { type: String, required: true }, //기본이미지 .. img(압축된 이미지) url
  tag: { type: Array },
  logined: { type: Boolean, required: true }, //로그인 햇는지.
  createBy: { type: String, required: true }, //아이디 만든 날짜!
  google: { type: String, unique: true }, //oauth 2.0 //이거들
  kakao: { type: String, unique: true },
  naver: { type: String, unique: true },
}); //아이디나 비밀번호 에러 . 성공햇을때 ., <-로그인/회원가입-> 예외처리(빈공간 x , 특수문자 x 아이디만 . urf-8 , 중복은 아이디만(login error msg->sam email 비밀번호 찾으라고 ). 성공 여부.)  .
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

var User = mongoose.model("user", userSchema); // 5
var Nov = mongoose.model("nov", novSchema);
var Comment = mongoose.model("comment", commentSchema);

app.get("/", function (req, res) {
  res.send("hello world");
});
app.get("/contacts", function (req, res) {
  //index페이지에 디비에 있는 내용을 뿌림
  User.find({}, function (err, contacts) {
    if (err) return res.json(err);
    res.render("contacts/index", { contacts: contacts });
  });
});
app.get("/signin/:users.email", function (req, res) {
  //index페이지에 디비에 있는 내용을 뿌림
  User.find({ _email: req.params.email }, function (err, users) {
    if (err) return res.json(err);
    if (_users.password == req.params.password) {
      res.render("/", { users: users });
    }
  });
});
app.post("/", function (req, res) {
  // contacts 액션으로 요청된 내용을 디비에 등록
  User.create(req.body, function (err, user) {
    if (err) return res.json(err);
    res.redirect("/");
  });
});
app.get("/novs", function (req, res) {
  //index페이지에 디비에 있는 내용을 뿌림
  Nov.find({}, function (err, novs) {
    if (err) return res.json(err);
    res.render("novs/index", { novs: novs });
  });
});
app.get("/comments", function (req, res) {
  Comment.find({}, function (err, comments) {
    if (err) return res.json(err);
    res.render({ comments: comments });
  });
});

// Contacts - New // 8

var port = 3000;
app.listen(port, function () {
  console.log("server on! http://localhost:" + port);
});
