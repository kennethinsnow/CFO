ITEMS_INCREMENT = 5;
Template.home.helpers({
    'urlSess': function(){
        if (Session.get('last')){
          var url = Session.get('last');
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
            return UrlRec.find({}, {sort:{createdAt:-1}});
  	} else {
            return 0;
  	}
    },
    'moreResults': function(){
        return !(UrlRec.find().count() < Session.get('linklistLimit'));
    }
});

Template.toplinks.helpers({
    'popularUrls': function(){
        if (UrlRec.find().count() != 0){
            return UrlRec.find({}, {sort:{createdAt:-1}});
        } else {
            return 0;
        }
    },
    'moreResults': function(){
        return !(UrlRec.find().count() < Session.get('toplinksLimit'));
    }
});

Template.linkItem.helpers({
    'imageLink': function(){
        if (this.image) return this.image;
        else {
            var images = ['images/abstract-q-c-700-300.jpg', 
            'images/animals-q-c-700-300.jpg',
            'images/business-q-c-700-300.jpg',
            'images/cats-q-c-700-300.jpg',
            'images/city-q-c-700-300.jpg',
            'images/fashion-q-c-700-300.jpg',
            'images/food-q-c-700-300.jpg', 
            'images/nature-q-c-700-300.jpg',
            'images/nightlife-q-c-700-300.jpg',
            'images/people-q-c-700-300.jpg',
            'images/sports-q-c-700-300.jpg',
            'images/technics-q-c-700-300.jpg',
            'images/transport-q-c-700-300.jpg'];
            return images[Math.floor(Math.random() * 13)];
        }
    }
});

Template.shortenbar.events({
    'click #convert': function(event, template){
            // console.log("convert is clicked");
            event.preventDefault();
            var longUrl = template.$('[name="longUrl"]').val();
            template.$('[name="longUrl"]').val("");
            // console.log(longUrl);
        if (!validateURL(longUrl)){
            FlashMessages.sendError("Url is invalid, please check it before submitting again.");
        } else {
            Meteor.call('getShortUrl', longUrl, function(error, result){
                if (error){
                  console.log(error.message);
                  FlashMessages.sendError(error.message);
                } else {
                  Session.set('last', result);
                }
            });
        }
    }
});

Template.linklist.onCreated(function(){
    Session.set('linklistLimit', ITEMS_INCREMENT);
    Deps.autorun(function(){
        Meteor.subscribe('userUrls', Session.get('linklistLimit'));
    });
});

Template.toplinks.onCreated(function(){
    Session.set('toplinksLimit', ITEMS_INCREMENT);
    Deps.autorun(function(){
        Meteor.subscribe('popularUrls', Session.get('toplinksLimit'));
    });
});

function validateURL(textval) {
    var urlregex = new RegExp(
    "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
    return urlregex.test(textval);
}

// whenever #showMoreResults becomes visible, retrieve more results
function showMoreVisible() {
    var threshold, target = $("#showMoreResults");
    if (typeof(target) === 'undefined') return;
    if (typeof(target.length) === 'undefined') return;
    // console.log(target);
    threshold = $(window).scrollTop() + $(window).height() - target.height();
 
    if (target.offset().top < threshold) {
        if (!target.data("visible")) {
            // console.log("target became visible (inside viewable area)");
            target.data("visible", true);
            Session.set("linklistLimit",
                Session.get("linklistLimit") + ITEMS_INCREMENT);
            Session.set("toplinksLimit",
                Session.get("toplinksLimit") + ITEMS_INCREMENT);
            // console.log(Session.get("linklistLimit"));
        }
    } else {
        if (target.data("visible")) {
            // console.log("target became invisible (below viewable arae)");
            target.data("visible", false);
        }
    }        
}
 
// run the above func every time the user scrolls
$(window).scroll(showMoreVisible);
