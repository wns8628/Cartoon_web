var client = require('cheerio-httpcli');

module.exports = function urlToJson(url,index,name,callback){

  client.fetch(url,function(err,$,res){
      var object = new Array();

      $('#post span.contents a').map(function(i,img){
          var img = $(img);
          var imgSrc = img.attr('href');
          object.push(imgSrc);
      });
      $('.separator a').map(function(i,img){
        var img =$(img);
        var imgSrc = img.attr('href');
        object.push(imgSrc);
      });
      $('#post span.contents img').map(function(i,img){
          var img = $(img);
          var imgSrc = img.attr('src');
          object.push(imgSrc);
      });
      $('div.post-body img').map(function(i,img){
          var img = $(img);
          var imgSrc = img.attr('src');
          object.push(imgSrc);
      });
      $('p img').map(function(i,img){
          var img = $(img);
          var imgSrc = img.attr('src');
          object.push(imgSrc);
      });
      callback(object,index,name,url);
  });
};
