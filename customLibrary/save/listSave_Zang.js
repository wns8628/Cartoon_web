//리스트세이브는 여기서처리
var urlToJson = require('./../urlToJson');
var ManhwaList = require('./../../models/ManhwaList');
var Manhwa = require('./../../models/Manhwa');
module.exports = function(){
  urlToJson('http://zangsisi.net/', function(data){
    ManhwaList.find({},function(err,Lists){
      if(err) console(err);
      for(var index in data){
        if(!urlIsIn(Lists,data[index].url)){
          var newManhwaList = new ManhwaList();
          newManhwaList.name = data[index].name;
          newManhwaList.url = data[index].url;
          newManhwaList.category = 'zang'; //잘봐
          newManhwaList.photo = '';
          // newManhwaList.newManhwa = 'true'
          console.log('save' + data[index].name);
          newManhwaList.save(function(err){
            if(err)
            console.log(err);
          });
        }
      }
    });
  });
};


var urlIsIn = function (arr, string){
  for(var index in arr){
    if(arr[index].url == string){
      return true;
    }
  }
  return false;
}

var async = require('async');//비동기를동기로

var logo_need = function(){

  var arrayname = new Array();
  var arrayimg = new Array();
  var a = 0;
  var i = 0;
  async.waterfall([function(callback){

  ManhwaList.find({},function(err,lists){
      for(var i =0; i < lists.length; i++){
        arrayname[i] = lists[i].name;
        }
        callback(null, arrayname);
    });
  },function(arrayname, callback){

    function square(arrayname,doneCallback){
      console.log(arrayname)
      Manhwa.findOne({listname:arrayname},function(err,logo_photoimg){
        if(logo_photoimg){
        ManhwaList.findOne({name:logo_photoimg.listname},function(err,logo_photo){
        logo_photo.photo = logo_photoimg.content[0];
        logo_photo.save();
        doneCallback(null);
      });
     }
    })
   }
    async.each(arrayname,square,function(err){
     if(err) console.log(err.message);
     else console.log("완료");
   });
  }],function(err){
    if(err) return res.json(err);
    });
  }
  logo_need();
