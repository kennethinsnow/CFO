Template.home.helpers({
	'urlSess': function(){
	    if (Session.get('shortUrl')){
	      var url = {
	        short: Session.get('shortUrl'),
	        long: Session.get('longUrl')
	      };
	      // console.log(url);
	      return url;
	    }
	  }
});
Template.currentLink.helpers({
	log: function(){
		console.log(this);
	}
});

Template.linklist.helpers({
  'urlsForCurUser': function(){
  	if (UrlRec.find().count() != 0){
      return UrlRec.find({}, {sort:{createdAt:-1}, limit:5});
  	} else {
  	  return 0;
  	}
  }
});

Template.toplinks.helpers({
  'popularUrls': function(){
  	if (UrlRec.find().count() != 0){
      return UrlRec.find();
  	} else {
  	  return 0;
  	}
  }
});

Template.shortenbar.events({
	'click #convert': function(event, template){
		console.log("convert is clicked");
		event.preventDefault();
		var longUrl = template.$('[name="longUrl"]').val();
		template.$('[name="longUrl"]').val("");
		console.log(longUrl);
	    if (!validateURL(longUrl)){
	    	FlashMessages.sendError("Url is invalid, please check it before submitting again.");
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

Template.linklist.onCreated(function(){
	this.subscribe('userUrls');
});

Template.toplinks.onCreated(function(){
	this.subscribe('popularUrls');
});

function validateURL(textval) {
	var urlregex = new RegExp(
	"^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
	return urlregex.test(textval);
}