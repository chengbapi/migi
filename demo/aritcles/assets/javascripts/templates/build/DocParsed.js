define(function(require) {
    var React = require('react');
    var markdown = require('markdown');
    var ArticleService = require('../../service/article');
    var ArticleSocketClient = ArticleService.socket;

    var DocParsed = React.createClass({displayName: "DocParsed",
        getInitialState: function() {
            return {
                loading: false,
                title: this.props.title
            };
        },
        componentDidMount: function() {
            ArticleSocketClient.on('article:change', this.articleChange);
            this.setState({ loading: true });

            this.props.percent.sub('change', this.scroll);
        },
        componentWillUnmount: function() {
            ArticleSocketClient.off('article:change', this.articleChange);
            this.props.percent.unsub('change', this.scroll);
        },
        scroll: function(percent) {
            var dom = $(this.getDOMNode());
            var height = dom.height();
            var totalHeight = dom.find('.content').height();

            var scrollTop = percent * (totalHeight - height);
            dom.scrollTop(scrollTop);
        },
        articleChange: function(article) {
            this.setState({
                loading: false,
                title: article.title
            });
            this.refs.content.getDOMNode().innerHTML = markdown.toHTML(article.content)

        },
        render: function() {
            var content;
            if (this.state.loading) {
                content = (
                    React.createElement("span", {className: "glyphicon glyphicon-repeat glyphicon-loading"})
                );
            } else {
                content = (
                    React.createElement("div", {ref: "content", className: "content"})
                );
            }
            return (
                React.createElement("div", {className: "doc"}, 
                    React.createElement("div", {className: "title"}, this.state.title), 
                    content 
                )
            );
        }
    });

    return DocParsed;
})
