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

//연재만화
router.get('/keepmanga',function(req,res,next){

  var page = Math.max(1,req.query.page)>1?parseInt(req.query.page):1;
  var limit = Math.max(1,req.query.limit)>1?parseInt(req.query.limit):8;
  var limitM = Math.max(1,req.query.limit)>1?parseInt(req.query.limit):18;
  var search = util.createSearch(req.query); //공지사항등 8개만보이게할려고필터??
  var mangasearch= util.mangaSearch(req.query);
  var errors = req.flash("errors")[0] || {};
  var now_time = new Date();
  var date = new Date();

  async.waterfall([function(callback){

    ManhwaList.count({category:'zang'})
      .exec(function(err,count){
        if(err) return callback(err);
        var skip = (page-1)*limitM;
        var maxPage = Math.ceil(count/limitM);
        callback(null, skip, maxPage);
      });
    },function(skip, maxPage, callback){

    ManhwaList.find({category:'zang'})  //흐음...
     .sort({name : 1 })
     .skip(skip)
     .limit(limitM)
     .exec(function(err,lists){
       if(err) return callback(err);
       res.render("manhwa_mini/keepmanga", {
           urlQuery:req._parsedUrl.query,
           errors:errors,
           search:search,
           maxPage:maxPage,
           page:page,
           lists : lists,
          });
    });
   }],function(err){
    if(err) return res.json(err);
  });
});

//완결만화
router.get('/finish_manga',function(req,res,next){
  var page = Math.max(1,req.query.page)>1?parseInt(req.query.page):1;
  var limit = Math.max(1,req.query.limit)>1?parseInt(req.query.limit):8;
  var limitM = Math.max(1,req.query.limit)>1?parseInt(req.query.limit):18;

  var search = util.createSearch(req.query); //공지사항등 8개만보이게할려고필터??
  var mangasearch= util.mangaSearch(req.query);
  var errors = req.flash("errors")[0] || {};
  var now_time = new Date();
  var date = new Date();
  now_time.setDate(now_time.getDate()-1);

  async.waterfall([function(callback){

    ManhwaList.count({category:'zang_finish'})
      .exec(function(err,count){
        if(err) return callback(err);
        var skip = (page-1)*limitM;
        var maxPageM = Math.ceil(count/limitM);
        callback(null, skip, maxPageM);
      });
    },function(skip, maxPageM, callback){
    ManhwaList.find({category:'zang_finish'})  //흐음...
     .sort({name:1})
     .skip(skip)
     .limit(limitM)
     .exec(function(err,lists){
       if(err) return callback(err);
        callback(null, lists , maxPageM, skip);
     });

   },function(lists, maxPageM, skip, callback){

    Post.find({})
     .populate(['author','comment'])
     .sort("-createdAt")
     .exec(function(err,posts_sub){
       var Notice = util.Splitmainboard(posts_sub,1);
       var Community = util.Splitmainboard(posts_sub,2);
       var QnA = util.Splitmainboard(posts_sub,3);
       if(err) return callback(err);
       callback(null, Notice, Community, QnA, lists,maxPageM, skip);
     });
   },function(Notice, Community, QnA, lists, maxPageM, skip ,callback){
      Post.count(search.findPost,function(err,count){
      if(err) callback(err);
      var skip = (page-1)*limit;
      var maxPage = Math.ceil(count/limit); //페이지갯수가나오겠지
      callback(null, Notice, Community, QnA, skip, maxPage, maxPageM,lists );
    });
  },function(Notice, Community, QnA, skip, maxPage, maxPageM,lists, callback){
    Post.find(search.findPost)
    .populate(['author','comment']) //Model.populate()함수는 relationship이 형성되어 있는 항목의 값을 생성해 줍니다
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)
    .exec(function(err,posts){
      if(err) return callback(err);
      res.render("manhwa_mini/finish_manga", {
          posts:posts,
          Notice:Notice,
          Community:Community,
          QnA:QnA,
          urlQuery:req._parsedUrl.query,
          errors:errors,
          search:search,
          maxPage:maxPage,
          maxPageM:maxPageM,
          page:page,
          lists : lists,
         });
    });
  }],function(err){
    if(err) return res.json(err);
  });
});

// Mongo DB에서 <, <=, >, >= 를 사용할 때,
// <  는  "$lt"
// <=  는  "$lte"
// >  는  "$gt"
// >=  는  "$gte"
router.get('/update', function(req, res, next){

  // Manhwa.remove({listname:"은혼"},function(err){
  //   res.redirect("/");
  // });
  var now_time = new Date();
  var date = new Date();
  now_time.setDate(now_time.getDate()-3);
  Manhwa
    .find({ updated: {$gte:now_time} , category : 'zang' }) //7일 이내 다출력 ㅇㅋ ?
    .sort({updated : -1})
    .exec(function(err,uplists){
        uplists = uplists.slice(0,50); //50개만추려서 보여주자
        res.render("manhwa_mini/update", {uplists : uplists,
                                          date : date,
                                          });
    });
});




router.get('/:manhwalistname',function(req,res,next){
  // console.log(req.params.manhwalistname);
  Manhwa
    .find({listname:req.params.manhwalistname})
    .sort({index:-1})
    .exec(function(err,list){
      var sendJsonData = new Array();
      for(var i in list){
        var putObject = new Object();
        putObject.name = list[i].name;
        putObject.listname = list[i].listname;
        putObject.index = list[i].index;
        putObject.contentlength = list[i].content.length;
        putObject.url = list[i].url;
        sendJsonData.push(putObject);
      }
      res.render("manhwa_mini/index", {
       lists:sendJsonData,
      });
    });
}); //걸러내는거임 쓸데없는 정보는 필요없으니

router.get('/:manhwalistname/:index',function(req,res,next){
  // console.log(req.para;ms.manhwalistname+' '+ req.params.index);
  var index_length;
  Manhwa
    .find({listname:req.params.manhwalistname })
    .sort({index:1})
    .exec(function(err,Mlength){
        index_length = Mlength.length;
  Manhwa
    .find({listname:req.params.manhwalistname, index : req.params.index })
    .sort({index:1})
    .exec(function(err,data){
      res.render("manhwa_mini/show", {
       lists:data[0],
       index_length : index_length,
      });
     });
    });
});


module.exports = router;
