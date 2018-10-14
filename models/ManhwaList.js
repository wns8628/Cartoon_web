var mongoose = require("mongoose");

var mangaListSchema = mongoose.Schema({
    name:String,
    url: String, //만화제목넣음
    category : String,
    tag : String,
    photo : String,
    newManhwa : String
});
//네임으로 이름받고 url로 크롤링할 만화가져와서 , 카테고리로 3개의 만화사이트에서 어느곳의 만화인지갈켜줌 /

// model & export
var ManhwaList = mongoose.model("manhwaList",mangaListSchema);
module.exports = ManhwaList;
