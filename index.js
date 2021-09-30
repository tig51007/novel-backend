var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser"); // 1
var app = express();
var cors = require("cors");
var methodOverride = require("method-override");
var mongo_db =
  "mongodb+srv://tig51007:djawnsgma312!@cluster0.y4he2.mongodb.net/NOVELBACKEND?retryWrites=true&w=majority";
// process.env.MONGO_DB
// DB setting
mongoose.connect(mongo_db); // 1
var db = mongoose.connection; //2
var dic={
  q : '2', w : 'o', e : 'i',  r : 'u',  t : 'y',
  y : 't', u : 'r', i : 'e',  o : 'w',  p : '8',
  a : 'l', s : '#', d : 'j',  f : 'h',  g : '6',
  z : 'm', x : 'n', c : 'b',  v : '4',  h : 'f',
  j : 'd', k : '_', l : 'a',  m : 'z',  n : 'x',
  b : 'c','1': '0',
 '2': 'q','3': '9','4': 'v', '5': '7', '6': 'g',
 '7': '3','8': 'p','9': '3', '0': '1', '`': '+',
 '!': '=','@': '-','#': 's', '$': ')', '%': '(',
 '^': '*','&': '~','+': '`', '=': '!', '-': '@',
 '_': 'k',')': '%','(': '^', '~': '&', '{': ']',
 '}': '[',':': ';','<': '/', '?': ',', '>': '.',
 '.': '>',',': '?','/': '<', ';': ':', '[': '}',
 ']': '{'

}
//3
db.once("open", function () {
  console.log("DB connected");
});
//4
db.on("error", function (err) {
  console.log("DB ERROR : ", err);
});

// Other settings
app.use(cors());
app.use(methodOverride("_method")); // 2

// Port setting //특수문자 라면 ERROR 메세지 Front end 로
var userSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true }, //이거 까지.
  email: { type: String, required: true }, //이거 key [key] => value
  password: { type: String }, //이거
  novelList: { type: String },
  profile: { type: String, required: true }, //기본이미지 .. img(압축된 이미지) url
  tag: { type: Array },
  logined: { type: Boolean, required: true }, //로그인 햇는지.
  createBy: { type: String, required: true }, //아이디 만든 날짜!
  google: { type: Boolean, unique: true }, //oauth 2.0 //이거들
  kakao: { type: Boolean, unique: true },
  naver: { type: Boolean, unique: true },
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
app.get("/signIn", function (req, res) {
  const {
    query: { email, password },
  } = req.header;
  var passwords=password.split('')
  var dicPasswords=[];
  for (const key in passwords){
    dicPasswords[key]=dic[passwords[key]]; 
  }
  var dicPassword=dicPasswords.join('');
  
  //index페이지에 디비에 있는 내용을 뿌림
  User.findOne({ email }, (err, result) => {
    try {
      const { password: awerPassword, google } = result;
      if (google) {
        res.send("google login");
      }
      if (dicPassword === awerPassword) {
        res.send("일치 합니다.");
      } else {
        res.send("일치하지 않습니다.");
      }
    } catch {
      res.send("email not found");
    }
  });
});
// a b c d 4 3 2 1 a-4 d-1=> c
// j s e q 

/*
var word = "djawnsgma312!";
var words = word.split('')
var dicWords=[];
for (const key in words){
dicWords[key]=dic[words[key]]; 
}
var dicWord=dicWords.join('');
console.log(dicWord)
*/
// words = word.splite('') 사전[word] result === password
app.get("/signUp", function (req, res) {
  //index페이지에 디비에 있는 내용을 뿌림
  
  const {
    query: { name , email, password, profile, logined, createBy, google },
  }=req.header;
  var passwords=password.split('')
  var dicPasswords=[];
  for (const key in passwords){
    dicPasswords[key]=dic[passwords[key]]; 
  }
  var dicPassword=dicPasswords.join('');
  
  User.create(name,email,dicPassword,profile,logined,createBy,google, function (err, contact) {
    if (err) return res.json(err);
    res.send("등록성공");
  });
});
app.put("/userEdit/:id", function (req, res) {
  User.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    function (err, contact) {
      //조건에 맞는 id를 업뎃
      if (err) return res.json(err);
     res.send("변경완료");
    }
  );
});
// Contacts - destroy // 6
app.delete("/userDel/:id", function (req, res) {
  User.deleteOne({ _id: req.params.id }, function (err) {
    if (err) return res.json(err);
    res.send("계정 삭제");
  });
});
// Contacts - New // 8

var port = 3000;
app.listen(port, function () {
  console.log("server on! http://localhost:" + port);
});
