define(function(require) {
    var React = require('react');
    var Doc = require('../templates/build/Doc');
    var DocParsed = require('../templates/build/DocParsed');
    var DocParsedText = require('../templates/build/DocParsedText');

    var PubSub = require('parasites/PubSub');

    return {
        enter: function(params) {
            var title = params[0];
            var rawContainer = document.createElement('div');
            rawContainer.id = 'raw-contianer';
            var parsedContainer = document.createElement('div');
            parsedContainer.id = 'parsed-contianer';
            var parsedText = document.createElement('div');
            parsedText.id = 'parsed-text';

            document.getElementById('content').appendChild(rawContainer);
            document.getElementById('content').appendChild(parsedContainer);
            document.getElementById('content').appendChild(parsedText);

            /* init current view percent */
            var percent = new PubSub();

            React.render(React.createElement(Doc, { title: title, percent: percent }), rawContainer);
            React.render(React.createElement(DocParsed, { title: title, percent: percent }), parsedContainer);
            React.render(React.createElement(DocParsedText, { title: title, percent: percent }), parsedText);
        },
        leave: function() {
            document.getElementById('content').removeChild(document.getElementById('raw-contianer'));
            document.getElementById('content').removeChild(document.getElementById('parsed-contianer'));
            document.getElementById('content').removeChild(document.getElementById('parsed-text'));
        }
    };
});
