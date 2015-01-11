define(function(require) {
    var $ = require('jquery');
    var React = require('react');
    var Doc = require('../templates/build/Doc');
    var DocParsed = require('../templates/build/DocParsed');

    return {
        enter: function(params) {
            var title = params[0];
            var rawContainer = document.createElement('div');
            rawContainer.id = 'raw-contianer';
            var parsedContainer = document.createElement('div');
            parsedContainer.id = 'parsed-contianer';

            document.getElementById('content').appendChild(rawContainer);
            document.getElementById('content').appendChild(parsedContainer);

            React.render(React.createElement(Doc, { title: title }), rawContainer);
            React.render(React.createElement(DocParsed, { title: title }), parsedContainer);
        },
        leave: function() {
            document.getElementById('content').removeChild(document.getElementById('raw-contianer'));
            document.getElementById('content').removeChild(document.getElementById('parsed-contianer'));
        }
    };
});
