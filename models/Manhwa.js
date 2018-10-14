var mongoose = require("mongoose");
var util  = require("../util"); // 1

var mangaSchema = mongoose.Schema({
    name:String, //뭐뭐1화
    content: Array, //뭐뭐1화의 이미지배열
    index:Number,
    commnet:Array,
    updated: {type: Date, default: Date.now},
    newManga : String,
    listname: String, //만화제목넣음
    category : String,
    url : String //뭐뭐1화의 주소
},{
  toObject:{virtuals:true}
});

mangaSchema.virtual("m_updDated")
.get(function(){
 return util.getDate_md(this.updated);
});

// model & export
var Manhwa = mongoose.model("manhwa",mangaSchema);
module.exports = Manhwa;
