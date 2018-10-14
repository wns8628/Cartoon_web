var client = require('cheerio-httpcli');

module.exports = function urlToJson(url,callback){
  client.fetch(url, function(err, $, res){
      var object = new Array();

      if(err){throw error};
      $('a.tx-link').map(function(i,a){
        a = $(a);
        object[i] = new Object();
        object[i].name = a.text();
        object[i].url = a.attr('href');
      });
      callback(object);
  });
};
