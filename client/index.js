
// format the date using momentjs
Template.registerHelper('formatDate', function(date) {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a');
});

Template.registerHelper('appendToBaseUrl', function(shortUrlId) {
  return Meteor.absoluteUrl('', {}) + shortUrlId;
});

Template.registerHelper('truncate', function(str, maxLen) {
	if (str.length <= maxLen) return str;
	else return str.substr(0, maxLen - 3) + "...";
});