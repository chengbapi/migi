define(function(require) {
    var React = require('react');
    var markdown = require('markdown');
    console.log(markdown)
    var ArticleService = require('../../service/article');
    var ArticleSocketClient = ArticleService.socket;

    var DocParsed = React.createClass({
        getInitialState: function() {
            return {
                loading: false,
                title: this.props.title
            };
        },
        componentDidMount: function() {
            ArticleSocketClient.on('article:change', this.articleChange);
            this.setState({ loading: true });
        },
        componentWillUnmount: function() {
            ArticleSocketClient.off('article:change', this.articleChange);
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
                    <span className="glyphicon glyphicon-repeat glyphicon-loading"></span>
                );
            } else {
                content = (
                    <div ref="content" className="content"></div>
                );
            }
            return (
                <div className="doc">
                    <div className="title">{this.state.title}</div>
                    { content }
                </div>
            );
        }
    });

    return DocParsed;
})
