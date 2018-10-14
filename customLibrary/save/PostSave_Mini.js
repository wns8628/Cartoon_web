var urlToJson = require('./../urlToJsonList_Zang');
var Manhwa = require('./../../models/Manhwa')
var urlToJsonPost = require('./../urlToJsonPost_Mini');
module.exports = function(manhwaListUrl,listname){
  urlToJson(manhwaListUrl, '#bo_v_con a',function(Manhwas){
    Manhwa
    .find({listname:listname})
    .find({category:'mini'})
    .sort({index:1})
    .exec(function(err,Lists){
      var ListsIndex = 0;
      if(err) console.log(err);
      for(var i in Manhwas){
        if(!urlIsIn(Lists,Manhwas[i].url)){
                      //1화의 url 이들어가고
          urlToJsonPost(Manhwas[i].url, i, Manhwas[i].name, function(imgArray,index, name, url){
            var newManhwa = new Manhwa();
            newManhwa.name = name;
            newManhwa.content = imgArray;
            newManhwa.listname = listname;
            newManhwa.listname = newManhwa.listname.replace(" ","").replace("?","");
            newManhwa.category = 'mini';
            newManhwa.index = index; //이걸로순서를조정?
            newManhwa.url = url;
            newManhwa.save();
            console.log('save post ' + name);
          });
        }else{
          Lists[ListsIndex].index=i;
          Lists[ListsIndex].save();
          ListsIndex +=1;
          console.log(Lists[i].name + ' index '+ ListsIndex);
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
