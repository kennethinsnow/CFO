
// format the date using momentjs
Template.registerHelper('formatDate', function(date) {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a');
});

Template.registerHelper('appendToBaseUrl', function(shortUrlId) {
  return Meteor.absoluteUrl('', {}) + shortUrlId;
});
