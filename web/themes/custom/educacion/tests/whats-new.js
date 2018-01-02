"use strict";


jQuery.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    jQuery.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

(function ($, Drupal) {
    Drupal.behaviors.whats_new_form = {
        attach: function (context, settings) {
            /*
             $.getJSON('/api/publications',{},function(data){
             console.log(data);
             });
             */
            Drupal.whats_new.renderPage(0, first_page);
            Drupal.whats_new.revailPage(0);


            $('.whats-new__load-more').click(function () {
                Drupal.whats_new.revailPage(Drupal.whats_new.page);
                $(this).blur();
            });

            $('#whats-new-form').change(function () {
                $('.whats-new-grid').css('opacity', 0.5);
                Drupal.whats_new.search();
            });
        }

    };

    Drupal.whats_new = {};


    Drupal.whats_new.search = function () {
        Drupal.whats_new.loadPage(0);
    };

    Drupal.whats_new.loadPage = function (n) {
        var filters = $('#whats-new-form').serializeObject();
        if (filters.type) filters.type = parseInt(filters.type);
        else filters.type = undefined;
        if (filters.date) {
            filters['date_min'] = filters.date + '-01-01';
            filters['date_max'] = filters.date + '-12-31';
        }
        filters.page = n;


        var grid = $('.whats-new-grid');
        var loadMore = $('.whats-new__load-more');
        loadMore.addClass('whats-new__load-more--hidden');


        $.getJSON('/api/publications', filters, function (data) {
            if (n == 0) {
                grid.css('opacity', 1);
                grid.empty();
            }
            Drupal.whats_new.page = n;
            Drupal.whats_new.renderPage(n, data);
            if (n == 0) Drupal.whats_new.revailPage(0);
            if (data.length > 0 && n > 0) loadMore.removeClass('whats-new__load-more--hidden');
        });
    };

    Drupal.whats_new.renderPage = function (n, data) {
        var page = $('<div class="whats-new__page whats-new__page--hidden"></div>').addClass('whats-new__page--' + n).hide();
        var template = '<div class="column medium-8 whats-new__item"><a href="{{ url }}" class="whats-new__item__img">{{ image }}</a><legend>{{ type }}</legend><a href="{{ url }}"><h4>{{ title }}</h4></a><p>{{ date }}</p></div>';
        data.forEach(function (article) {
            var item = template.replace('{{ image }}', article.image).replace(/{{ url }}/g, article.url).replace('{{ title }}', article.title).replace('{{ date }}', article.date).replace('{{ type }}', article.type);
            page.append(item);
        });
        $('.whats-new-grid').append(page);

    }

    Drupal.whats_new.revailPage = function (n) {
        var page = $('.whats-new__page--' + n);
        page.show();
        setTimeout(function () {
            page.removeClass('whats-new__page--hidden');
        }, 100);

        Drupal.whats_new.loadPage(n + 1);
    }

})
(jQuery, Drupal, first_page);



