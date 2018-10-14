var client = require('cheerio-httpcli');

module.exports = function urlToJson(url,index,name,callback){
  client.fetch(url,function(err,$,res){
    var object = new Array();


    $('div#bo_v_con img').map(function(i,img){

      var img = $(img);
      var imgSrc = img.attr('src');

      object.push(imgSrc);

    });
    callback(object,index, name,url);
  });
}
