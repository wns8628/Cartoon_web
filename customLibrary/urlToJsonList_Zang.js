var client = require('cheerio-httpcli');

module.exports = function urlToJson(url,parseString,callback){
  client.fetch(url,function(err,$,res){
    var object = new Array();

    // if(err) {throw error};

    $(parseString).map(function(i,item){
     var putObject = new Object();
      //url과 (뭐뭐1화 2화 )만있으면된다.
      putObject.name = $(item).html();  //뭐뭐1화 뭐뭐2화 이렇게
      putObject.url = $(item).url();  //각가유알엘
      object.push(putObject);

    });
    callback(object);
    // console.log('개수 : ' + object.length)
  });

}
