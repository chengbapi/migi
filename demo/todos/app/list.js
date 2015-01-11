define(function(require) {
    var $ = require('jquery');
    var ArticleService = require('../service/article');

    return {
        enter: function() {
            console.log('enter list');
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
        },
        leave: function() {
            console.log('leave list');
        }
    };
});
