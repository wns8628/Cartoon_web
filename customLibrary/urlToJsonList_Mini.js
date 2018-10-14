var client = require('cheerio-httpcli');

module.exports = function urlToJson(url,parseString,callback){
  client.fetch(url,function(err,$,res){
    var object = new Array();

    if(err) {throw error};

    $(parseString).map(function(i,item){
      item = $(item).html();

      var putObject = new Object();

      putObject.name = $('li.gall_text_href a',item).text();
      putObject.name = putObject.name.replace("\n","").replace(" ","");//.slice(24,putObject.name.length);
      putObject.url = $('li.gall_text_href a',item).attr('href');
      putObject.url = putObject.url.replace("≀","&wr_");
      putObject.tag = $(item)["5"].children[0].children[0].data;
      putObject.photo = $('img',item).attr('src');
      putObject.category = 'mini';
      object.push(putObject);


      // console.log($('img',item).attr('src'));
      // console.log($('li.gall_text_href a', item).attr('href').replace("≀","&wr_"));
      // console.log($('li.gall_text_href a', item).text()); //제목나오네
      // console.log($(item)["5"].children[0].children[0].data); //카테고리나오네

    });
    callback(object);
     console.log('개수 : ' + object.length);
  });

}
