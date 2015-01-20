define(function(require) {
    var $ = require('jquery');
    var Article = require('../model/article');
    var Socket = require('migi/Socket');
    var Deferred = require('migi/Deferred');
    var socket = new Socket();
    var SocketServer = socket.server;

    var ArticleService = {
        socket: socket.client,
        getArticles: function() {
            var def = Deferred();
            $.ajax({
                url: 'data/article/get_article_list.php',
                type: 'GET',
                dataType: 'json'
            }).done(function(data) {
                if (data.status) {
                    def.resolve(data.articles);
                } else {
                    def.reject(data.error);
                }
            });
            return def;
        },
        getArticle: function(title) {
            var def = Deferred();
            $.ajax({
                url: 'data/article/get_article.php',
                type: 'GET',
                dataType: 'json',
                data: {
                    title: title
                }
            }).done(function(data) {
                if (data.status) {
                    Article.title = data.title;
                    Article.content = data.content;
                    def.resolve(Article);
                    SocketServer.emit('article:change', Article);
                } else {
                    def.reject(data.error);
                }
            });
            return def;
        },
        syncArticle: function(article, toServer) {
            var def = Deferred();
            if (toServer) {
                $.ajax({
                    url: 'data/article/post_article.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        title: article.title,
                        content: article.content
                    }
                }).done(function(data) {
                    if (data.status) {
                        Article.title = article.title;
                        Article.content = article.content;
                        SocketServer.emit('article:change', Article);
                        def.resolve(Article);
                    } else {
                        def.reject(data.error);
                    }
                });
            } else {
                // 只存在本地
                Article.title = article.title;
                Article.content = article.content;
                SocketServer.emit('article:change', Article);
                def.resolve(Article);
            }
            return def;
        }
    };

    return ArticleService;
});
