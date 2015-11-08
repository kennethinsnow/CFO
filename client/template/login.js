Template.register.events({
	'submit .register-form': function(event) {
		var username = encodeURI(event.target.username.value);
	    var email = encodeURI(event.target.email.value);
	    var password = encodeURI(event.target.password.value);
	    var password2 = encodeURI(event.target.password2.value);

	    event.preventDefault();
	    if (isNotEmpty(username) && isNotEmpty(email) && isNotEmpty(password)
	      && isEmail(email) && areValidPasswords(password, password2)) {
	      // create new user
	      Accounts.createUser({
	    	username: username,
	        email: email,
	        password: password
	      }, function(err) {
	        if (err) {
	          FlashMessages.sendError('There was an error with registration');
	        } else {
	          FlashMessages.sendSuccess('Account Created! You are now logged in');
	          cleanSess('last');
	          Router.go('/');
	        }
	      });
	    }
	    return false;
	  }
});

Template.login.events({
  'submit .login-form': function(event) {
	event.preventDefault();
    // get form values
    var username = encodeURI(event.target.username.value);
    var password = encodeURI(event.target.password.value);
    Meteor.loginWithPassword(username, password, function(err) {
      if (err) {
        event.target.username.value = username;
        event.target.password.value = password;
        FlashMessages.sendError("Username and password are wrong");
        console.log(err.reason);
      } else {
        FlashMessages.sendSuccess('You are now logged in');
        cleanSess('last');
        Router.go('/');
      }
    });
  }
});

Template.nav.events({
	'click .logout': function(events){
		events.preventDefault();
		Meteor.logout();
		cleanSess('last');
		Router.go('/');
	}
});

// validations

var trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, '');
}

var isNotEmpty = function(val) {
  if (val && val !== '') {
    return true;
  }
  FlashMessages.sendError('Please fill in all fields');
  return false;
}

var isEmail = function(val) {
  var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (filter.test(val)) {
    return true;
  }
  FlashMessages.sendError('Please use a valid email address');
  return false;
}

var isValidPassword = function(password) {
  if (password.length < 6) {
    FlashMessages.sendError('Password must be at least 6 characters');
    return false;
  }
  return true;
}

var areValidPasswords = function(password, confirm) {
  if (!isValidPassword(password)) {
    return false;
  }
  if (password !== confirm) {
    FlashMessages.sendError('Passwords do not match');
    return false;
  }
  return true;
}

var cleanSess = function(key){
	Session.set(key, undefined);
    delete Session.keys[key];
}