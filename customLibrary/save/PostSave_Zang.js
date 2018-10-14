var urlToJson = require('./../urlToJsonList_Zang');
var Manhwa = require('./../../models/Manhwa')
var urlToJsonPost = require('./../urlToJsonPost_Zang');
module.exports = function(manhwaListUrl,listname){
  urlToJson(manhwaListUrl, 'div#post div.contents p a',function(Manhwas){
    Manhwa
    .find({listname:listname})
    .sort({index:1})
    .exec(function(err,Lists){
      var ListsIndex = 0;
      if(err) console.log(err);
      for(var i in Manhwas){
        if(!urlIsIn(Lists,Manhwas[i].url)){
          urlToJsonPost(Manhwas[i].url, i, Manhwas[i].name, function(imgArray,index, name, url){
            var newManhwa = new Manhwa();
            newManhwa.name = name;
            newManhwa.content = imgArray;
            newManhwa.listname = listname;
            newManhwa.category = 'zang'; //여기저장할떄 잘봐
            // newManhwa.updated = Date.now() - 8; 이거 잘몰겟다..
            newManhwa.index = index; //이걸로순서를조정?
            newManhwa.url = url;
            // newManhwa.newManga = 'true'; //신작넣을때여기 트루
            newManhwa.save();
            console.log('save post ' + name);
          });
        }else{
          Lists[ListsIndex].index=i;
          // Lists[ListsIndex].save();
          ListsIndex +=1;
          // console.log(Lists[i].name + ' index '+ ListsIndex);
        }
      }
    })
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
