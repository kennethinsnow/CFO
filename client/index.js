Meteor.subscribe('theUrls');
Template.urlForm.helpers({
  'urlInfo': function(){
    if (Session.get('shortUrl')){
      var url = {
        short: Session.get('shortUrl'),
        long: Session.get('longUrl')
      };
      console.log(url);
      return url;
    }
  },
  'urlForCurUser': function(){
  	return UrlRec.find({}, {sort:{createdAt:-1}, limit:20});
  }
});

Template.urlForm.events({
  'submit form': function(event){
    event.preventDefault();
    var longUrl = event.target.longUrl.value;
    event.target.longUrl.value = ""; 
    if (!validateURL(longUrl)){
    	FlashMessages.sendError("Url is invalid, please check before submitting it again.");
    } else {
	    Meteor.call('getShortUrl', longUrl, function(error, result){
	      if (error){
	        console.log(error.message);
	        FlashMessages.sendError(error.message);
	      } else {
	      	Session.set('shortUrl', result);
	        Session.set('longUrl', longUrl);
	      }
	    });
    }
  }   
});

// format the date using momentjs
Template.registerHelper('formatDate', function(date) {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a');
});

Template.registerHelper('appendToBaseUrl', function(shortUrlId) {
  return Meteor.absoluteUrl('', {}) + shortUrlId;
});

function validateURL(textval) {
	var urlregex = new RegExp(
	"^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
	return urlregex.test(textval);
}
