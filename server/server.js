Meteor.publish('theUrls', function(){
	var curUserId = this.userId;
	return UrlRec.find({userId:curUserId});
});

Meteor.methods({
  'getShortUrl': function(longUrl){
    var currentUserId = Meteor.userId();
    if (!currentUserId){
    	currentUserId = 'guest_user_';
    }
    var doc = UrlRec.findOne({long:longUrl, userId: currentUserId});
    var shortS;
    if (doc){
  	  shortS = doc.short;
   	  UrlRec.update({
	    short: shortS,
	    userId: currentUserId
	  }, {$set: {createdAt: new Date()}}, function(err, res){
   	    if (err){
	      // FlashMessages.sendError('insert to Urls failed: ' + err.messge);
	      throw err;
	    }
	  });
    } else {
	  var shortS = getSURL();
	  UrlRec.insert({
	    short: shortS,      
	    long: longUrl,
	    createdAt: new Date(),
	    userId: currentUserId
	  }, function(err, res){
   	    if (err){
	      // FlashMessages.sendError('insert to Urls failed: ' + err.messge);
	      throw err;
	    }
	  });
    }
    return Meteor.absoluteUrl('', {}) + shortS;
  },
  'getUrlByCurUser': function(){
	  var curUserId = this.userId;
	  return UrlRec.find({userId:curUserId});
  }
});

// return a random interger number that is not in the database
var getSURL = function(){
  // check if long url already exists and created by the same user.
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
