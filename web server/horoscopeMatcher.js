var mongoose = require('mongoose');
var schema = mongoose.Schema;

var horoMatcherSchema = new schema({
    zodiac: { type:String, index:1,required:true,unique:true },
    matcher_horo : [{ zodiac: String, text: String }],
}, {collection:'matcher_horoscope'} );

var HoroMatcher = mongoose.model('HoroMatcher',horoMatcherSchema);
module.exports = HoroMatcher;