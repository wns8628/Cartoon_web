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


// 연재중 만화표시
router.get('/manga_ing_ajax',function(req,res,next){

  var page = Math.max(1,req.query.page)>1?parseInt(req.query.page):1;
  var limit = Math.max(1,req.query.limit)>1?parseInt(req.query.limit):15;

async.waterfall([function(callback){

ManhwaList.count({category:'zang'})
  .exec(function(err,count){
    if(err) return callback(err);
    var skip = (page-1)*limit;
    var maxPage = Math.ceil(count/limit);
    callback(null, skip, maxPage);
  });
},function(skip, maxPage, callback){
  ManhwaList.find({category:'zang'})
  .sort({name : 1 })
  // .skip(skip)
  // .limit(limit)
  .exec(function(err,list_finish){
    //json 형식으로 보내 준다.
    // console.log(list_finish.length)
    res.send({result:true, msg:list_finish, maxPage:maxPage, skip:skip});
  });
}],function(err){
  if(err) return res.json(err);
 });
});

//완결 만화표시
router.get('/manga_finish_ajax',function(req,res,next){
  ManhwaList.find({category:'zang_finish'})
  .sort({name : 1 })
  .exec(function(err,list_finish){

    //json 형식으로 보내 준다.
    res.send({result:true, msg:list_finish});
  });
});

//검색만화표시
router.post('/manga_search_ajax',function(req,res,next){

  var search_name = req.body.msg;
  // var search = util.createSearch(req.query);
  var mangasearch= util.mangaSearch(search_name);

  if(req.body.msg.length >= 2){
    ManhwaList.find(mangasearch.findPost)
    .sort({name : 1 })
    .exec(function(err,list_finish){
      //json 형식으로 보내 준다.
      if(list_finish.length > 0){
        res.send({result:true, msg:list_finish});
      }else if(list_finish.length == 0){
        res.send({result:false, msg:'찾을 수 없습니다.'});
      }
    });
  }else{
    res.send({result:false, msg:'두글자 이상입력.'});
  }

});



module.exports = router;
