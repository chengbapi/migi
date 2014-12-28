define(function() {
    var _ = require('underscore');
    var Events = require('./Events');

    function App() {

    }

    _.extend(App.prototype, Events);

    // implement start & end
    // app.on('start', func);
    // app.on('end', func);

    return App;

});
