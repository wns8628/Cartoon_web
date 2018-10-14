//리스트세이브는 여기서처리
var urlToJson = require('./../urlToJsonList_Mini');
var ManhwaList = require('./../../models/ManhwaList');
module.exports = function(){
  urlToJson('http://minitoon.net/bbs/board.php?bo_table=9997', '#gall_ul ul.gall_con',function(data){
    ManhwaList.find({},function(err,Lists){
      if(err) console(err);
      for(var index in data){
        if(!urlIsIn(Lists, data[index].url)){
          var newManhwaList = new ManhwaList();
          newManhwaList.name = data[index].name;
          newManhwaList.name = newManhwaList.name.replace(" ","").replace("?","");
          newManhwaList.url = data[index].url;
          newManhwaList.photo = data[index].photo;
          newManhwaList.tag = data[index].tag;
          newManhwaList.category = 'mini';

          console.log('save'+data[index].name);
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
};
