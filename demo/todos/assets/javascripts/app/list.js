define(function(require) {
    var $ = require('jquery');
    var ArticleService = require('../service/article');

    return {
        over: function() {
            ArticleService.getArticles().done(function(articles) {
                var html = '<ul>';
                var articlesHtml = articles.map(function(article) {
                    return '<li class="article-item">' +
                            '<a href="#/detail/' + article.title + '">' +
                            article.title +
                            '</a>' +
                            '</li>';
                });
                html += articlesHtml.join('');
                html += '</ul>';
                $("#content").html(html);
            });
            console.log('over list');
        },
        out: function() {
            $("#content").html('');
            console.log('out list');
        }
    };
});
