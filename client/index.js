Template.urlForm.helpers({
  'urlInfo': function(){
    if (Session.get('shortUrl')){
      var url = {
        short: Session.get('shortUrl'),
        long: Session.get('longUrl')
      };
      return url;
    }
  }
});

Template.urlForm.events({
  'submit form': function(event){
    event.preventDefault();
    var longUrl = event.target.longUrl.value;
    event.target.longUrl.value = ""; 
    Session.set('longUrl', longUrl);
    var shortUrl = Meteor.call('getShortUrl', longUrl);
    Session.set('shortUrl', shortUrl);
  }   
});
