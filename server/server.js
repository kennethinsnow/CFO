Meteor.methods({
  'getShortUrl': function(longUrl, callback){
    var currentUserId = Meteor.userId();
    var shortS = getSURL();
    // console.log(Meteor.absoluteUrl('/', {}));
    console.log(shortS);
    console.log(longUrl);
    UrlRec.insert({
      short: shortS,
      long: longUrl,
      userId: currentUserId
    });
    return Meteor.absoluteUrl('', {}) + shortS;
  }
});

// return a random interger number that is not in the database
var getSURL = function(){
  var rNum = 0;
  var str = '';
  do {
    rNum = getRandomIntInclusive(0, Math.pow(51, 6) - 1);
    // console.log(rNum);
    str = ShortURL.encode(rNum);
    // console.log(str);
  } while (UrlRec.find({short: str}).count() > 0);
  return str;
};

var getRandomIntInclusive = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
* ShortURL: Bijective conversion between natural numbers (IDs) and short strings
*
* ShortURL.encode() takes an ID and turns it into a short string
* ShortURL.decode() takes a short string and turns it into an ID
*
* Features:
* + large alphabet (51 chars) and thus very short resulting strings
* + proof against offensive words (removed 'a', 'e', 'i', 'o' and 'u')
* + unambiguous (removed 'I', 'l', '1', 'O' and '0')
*
* Example output:
* 123456789 <=> pgK8p
*
* Source: https://github.com/delight-im/ShortURL (Apache License 2.0)
*/
var ShortURL = new function() {
  var _alphabet = '23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ-_',
      _base = _alphabet.length;
  this.encode = function(num) {
    var str = '';
    while (num > 0) {
      str = _alphabet.charAt(num % _base) + str;
      num = Math.floor(num / _base);
    }
    while (str.length < 6) str = _alphabet.charAt(0) + str;
    return str;
  };
  this.decode = function(str) {
    var num = 0;
    for (var i = 0; i < str.length; i++) {
      num = num * _base + _alphabet.indexOf(str.charAt(i));
    }
    return num;
  };
};
