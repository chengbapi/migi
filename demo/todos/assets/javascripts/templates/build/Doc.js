define(function(require) {
    var React = require('react');
    var ArticleService = require('../../service/article');
    var ArticleSocketClient = ArticleService.socket;

    var Doc = React.createClass({displayName: "Doc",
        getInitialState: function() {
            return {
                loading: false,
                title: this.props.title,
                content: ''
            };
        },
        componentDidMount: function() {
            var self = this;
            var title = this.props.title;
            ArticleService.getArticle(title).done(function(article) {
                self.setState({
                    loading: false,
                    title: article.title
                });
                self.refs.content.getDOMNode().innerText = article.content;
            });
            this.setState({ loading: true });
        },
        componentWillUnmount: function() {

        },
        _syncArticle: function(toServer) {
            var title = this.refs.title.getDOMNode().value;
            var content = this.refs.content.getDOMNode().innerText;
            this.setState({
                title: title
            });
            return ArticleService.syncArticle({
                title: title,
                content: content
            }, toServer);
        },
        syncArticle: function() {
            this._syncArticle();
        },
        saveArticle: function() {
            this._syncArticle(true).done(function(article) {
                alert('saved! article:' + article.title);
            });
        },
        render: function() {
            var content;
            if (this.state.loading) {
                content = (
                    React.createElement("span", {className: "glyphicon glyphicon-repeat glyphicon-loading"})
                );
            } else {
                content = (
                    React.createElement("div", {ref: "content", className: "content", contentEditable: true, onInput: this.syncArticle})
                );
            }
            return (
                React.createElement("div", {className: "doc"}, 
                    React.createElement("input", {ref: "title", type: "text", className: "title", onChange: this.syncArticle, value: this.state.title}), 
                    content, 
                    React.createElement("button", {className: "btn btn-large btn-primary btn-block", onClick: this.saveArticle}, "Save")
                )
            );
        }
    });

    return Doc;
})
