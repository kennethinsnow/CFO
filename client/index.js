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
  }
});

Template.urlForm.events({
  'submit form': function(event){
    event.preventDefault();
    var longUrl = event.target.longUrl.value;
    event.target.longUrl.value = ""; 
    Meteor.call('getShortUrl', longUrl, function(error, result){
      if (error){
        console.log(error.reason);
      } else {
      	Session.set('shortUrl', result);
        Session.set('longUrl', longUrl);
      }
    });
  }   
});
