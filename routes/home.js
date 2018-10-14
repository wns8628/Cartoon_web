var express = require("express");
var router = express.Router();
var passport= require("../config/passport"); // 1
var Post = require("../models/Post");
var Comment = require("../models/Comment");
var Counter = require("../models/Counter");
var util  = require("../util");
var async = require('async');//비동기를동기로
var ManhwaList = require('../models/ManhwaList');
var Manhwa = require('../models/Manhwa');
//home
router.get('/',function(req,res,next){

  var page = Math.max(1,req.query.page)>1?parseInt(req.query.page):1;
  var limit = Math.max(1,req.query.limit)>1?parseInt(req.query.limit):8;
  var search = util.createSearch(req.query); //공지사항등 8개만보이게할려고필터??
  var mangasearch= util.mangaSearch(req.query);
  var errors = req.flash("errors")[0] || {};
  var now_time = new Date();
  var date = new Date();
  now_time.setDate(now_time.getDate()-2);

  async.waterfall([function(callback){

    Manhwa
      .find({updated: {$gte:now_time} , category : 'zang', newManga:{$ne:"true"} }) //7일 이내 다출력 ㅇㅋ ? category : 'zang' 원래..
      .sort({updated : -1})
      .exec(function(err,uplists){
          uplists = uplists.slice(0,20); //50개만추려서 보여주자
          callback(null, uplists);
      });
  },function(uplists, callback){

    ManhwaList.find(mangasearch.findPost)  //흐음...
     .sort({name : 1 })
     .exec(function(err,lists){
       if(err) return callback(err);
        callback(null, uplists, lists);
     });
   },function(uplists, lists, callback){

    Post.find({})
     .populate(['author','comment'])
     .sort("-createdAt")
     .exec(function(err,posts_sub){
       var Notice = util.Splitmainboard(posts_sub,1);
       var Community = util.Splitmainboard(posts_sub,2);
       var QnA = util.Splitmainboard(posts_sub,3);
       if(err) return callback(err);
       callback(null, Notice, Community, QnA, lists ,uplists );
     });
   },function(Notice, Community, QnA, lists, uplists, callback){
      Post.count(search.findPost,function(err,count){
      if(err) callback(err);
      var skip = (page-1)*limit;
      var maxPage = Math.ceil(count/limit); //페이지갯수가나오겠지
      callback(null, Notice, Community, QnA, skip, maxPage, lists , uplists);
    });
  },function(Notice, Community, QnA, skip, maxPage, lists, uplists, callback){
      ManhwaList.find( { newManga : "true" } ,function(err, newManhwa){
        if(err) callback(err);
        callback(null, Notice, Community, QnA, skip, maxPage, lists , uplists, newManhwa);
      });

  },function(Notice, Community, QnA, skip, maxPage, lists, uplists, newManhwa,callback){
     Post.find(search.findPost)
    .populate(['author','comment']) //Model.populate()함수는 relationship이 형성되어 있는 항목의 값을 생성해 줍니다
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)
    .exec(function(err,posts){
      if(err) return callback(err);
      res.render("home/welcome", {
          posts:posts,
          Notice:Notice,
          Community:Community,
          QnA:QnA,
          urlQuery:req._parsedUrl.query,
          errors:errors,
          search:search,
          maxPage:maxPage,
          page:page,
          lists : lists,
          uplists : uplists,
          newManhwa: newManhwa
         });
    });
  }],function(err){
    if(err) return res.json(err);
  });
});


router.get("/about", function(req, res){
  res.render("home/about");
});

// Login // 2
router.get("/login", function (req,res) {
 var username = req.flash("username")[0]; //로그인에 에러화면보여주기위해쓰는거알제
 var errors = req.flash("errors")[0] || {};
 res.render("home/login", {
  username:username,
  errors:errors
 });
});

// Post Login // login form에서 보내진 post request를 처리해 주는 route입니다.
router.post("/login",
 function(req,res,next){
  var errors = {};
  var isValid = true;
  if(!req.body.username){ //유저네임이비어있다면
    console.log("아이디빔");
   isValid = false;
   errors.username = "아이디를 적어주세요"; //그냥 바로정의한거네 errors.username
  }
  if(!req.body.password){
   isValid = false;
   errors.password = "비밀번호를 적어주세요";
  }

  if(isValid){  //값이있다면
   next(); //넥스트~
 } else { //페일이면
   req.flash("errors",errors); //플래시에러생성 errors는 위에 에러스 객체가들가겠지
   res.redirect("/login");    //로그인페이지로 리다이렉트
  }
 },
 passport.authenticate("local-login", {  //두번째 콜백함수인데
  successRedirect : "/",              //passport local strategy를 호출해서 authentication(로그인)을 진행
  failureRedirect : "/login"
 }
));

// Logout // 4
router.get("/logout", function(req, res) {
 req.logout();
 res.redirect("/");
});


module.exports = router;
