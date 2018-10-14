var urlToJson = require('./../urlToJsonList_Zang');
var Manhwa = require('./../../models/Manhwa')
var urlToJsonPost = require('./../urlToJsonPost_Zang');
module.exports = function(manhwaListUrl,listname){
  urlToJson(manhwaListUrl, 'div#post div.contents ppap a',function(Manhwas){
    Manhwa                                        //여기확인 걍놔둬..
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
            newManhwa.category = 'zang';
            newManhwa.index = index;  //+68 1068이렇게됨 ..ㅅㅂ 은혼.. 이걸로순서를조정?
            newManhwa.url = url;
            newManhwa.save();
            console.log('save post ' + name);
          });
        }else{
          Lists[ListsIndex].index=i;
          // Lists[ListsIndex].save();
          ListsIndex +=1;
          console.log(Lists[i].name + ' index '+ ListsIndex);
        }
      }
      // 여기는 이제 장시시가 원피스같은거 목록에안올렷을때 여기직접하면됨 ㅇㅋ ? 원펀맨 헌터이런거 목록잘안하드라 ..
                      // 여기 바꾸고                                //여기
      urlToJsonPost('http://zangsisi.net/?p=501248', ListsIndex, '은혼 683화', function(imgArray,index, name, url){
        var newManhwa = new Manhwa();
        newManhwa.name = name;
        newManhwa.content = imgArray;
        newManhwa.listname = '은혼'; //여기맞추고  하면됨ㅇㅋ ?
        newManhwa.category = 'zang';
        newManhwa.index = 3000; // 여기지정해주고! 그리고 인덱스 나오는거 +1해서  다음거까지하면될듯?
        newManhwa.url = url;      //*은혼은 없데이트할때마다 1000 2000 3000 이렇게 천단위로 넣어라 인덱스
        newManhwa.save();
        console.log('save post ' + name);
      });
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
