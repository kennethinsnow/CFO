Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    path:'/',
    name:'home',
    template:'home'
});

Router.route('login');
Router.route('register');

Router.route('/:short', {
    path:'/:short',
    action: function(){
        var record = UrlRec.findOne({short: this.params.short});
        if (record){
            // console.log('redirect to: ' + record.long);
            this.response.writeHead(301, {Location: record.long});
            this.response.end();
        } else {
            this.next();
        }
    },
    where: 'server'
});