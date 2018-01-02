"use strict";

(function ($, Drupal) {
    var isTouchDevice = 'ontouchstart' in document.documentElement;


    Drupal.behaviors.onload_bg = {
        attach: function (context, settings) {

            function check_bg_images() {
                $('.js-onload-bg:visible').each(function () {
                    var _this = this;
                    var image = $(this).css('background-image').replace('url("', '').replace('")', '');
                    var img = new Image();
                    img.onload = function () {
                        $(_this).css('opacity', 1);
                    };
                    setTimeout(function () {
                        $(_this).css('opacity', 1);
                    }, 2000);
                    img.src = image;
                });
            }

            check_bg_images();
            $(window).resize(check_bg_images);

        }
    }

    Drupal.behaviors.scroll = {
        attach: function (context, settings) {
            var onScroll = [];

            function registerScrollevents() {
                onScroll = [];

                
                if ($('body.path-frontpage').length > 0)
                     onScroll.push(changeHeaderSize);

                if ($('.share-this').length > 0)
                    if ($(window).width() > 1140) {
                        onScroll.push(stickyShare);
                    } else {
                        $('.share-this').css('position', '').css('top', '').css('opacity', '');
                    }                 
            }

            //register scroll events now
            registerScrollevents();

            //... and on resize
            $(window).resize(registerScrollevents);

            //set up the listener
            $(window).scroll(function () {
                onScroll.forEach(function (item) {
                    item();
                });
            });
    
            // scroll animate buttons
            $('.js-scroll').click(function (e) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'data-target')).offset().top - 30
                }, 500);
                return false;
            });

            function changeHeaderSize() {                
                if ($(window).scrollTop() >= 100) {
                    $('.header').addClass('header--small');
                } else {
                    $('.header').removeClass('header--small');
                }   
            }

            function stickyShare() {
                if ($('.breadcrumb').offset().top - $(window).scrollTop() < 200)
                    $('.share-this').css('position', 'fixed').css('top', '200px');
                else  $('.share-this').css('position', 'absolute').css('top', 0);

                if ($('.node__content').offset().top + $('.node__content').height() - $(window).scrollTop() < 400)
                    $('.share-this').css('opacity', 0)
                else
                    $('.share-this').css('opacity', 1);

            }
        }
    };

    Drupal.behaviors.content = {
        attach: function (context, settings) {
            var headers = [];
            $('.region-content article table th').each(function () {
                headers.push($(this).text())
            });

            $('.region-content article table td').each(function () {
                var col = $(this).parent().children().index($(this));
                var header = $('<header>').text(headers[col]);
                var span = $('<span>').text($(this).text());
                $(this).empty().prepend(span).prepend(header);
            });

            $('.region-content a[data-entity-type=file]').each(function () {
                $(this).attr('target', '_blank');
            });

            //$('.region-content article table tbody tr').each('')
        }
    };


    Drupal.behaviors.form = {
        attach: function (context, settings) {

            //std form
            $('.general-form input, .general-form textarea').blur();

            $('.general-form input, .general-form textarea').focus(function () {
                $(this).parents('.js-form-item').addClass('general-form__field-active');
            });

            $('.general-form input, .general-form textarea').blur(function () {
                if (!$(this).val() > '')
                    $(this).parents('.js-form-item').removeClass('general-form__field-active');
            });
      
        }
    }

    Drupal.behaviors.cookies = {
        attach: function (context, settings) {

            var cookie = Cookies.get('cookie-notice');

            if (typeof  cookie == 'undefined') {
                jQuery('#cookies-notice').addClass('cookies-notice--visible');
                jQuery('a').click(function () {
                    remove_cookie_notice();
                });
                jQuery(window).scroll(function () {
                    setTimeout(remove_cookie_notice, 3000);
                });
            }

            function remove_cookie_notice() {
                jQuery('#cookies-notice').removeClass('cookies-notice--visible');
                Cookies.set('cookie-notice', 'yes', {expires: 1000});
            }

        }
    };

    Drupal.behaviors.filtered_view = {
        attach: function (context, settings) {
            var form = $('.actividades-form');

            if (!form.length > 0) return;

            var options = {};
            if ($('.actividades-form').length > 0)
                options = {
                    apiUrl: '/api/actividades',
                    renderItem: function (item) {
                        var template = '<div class="column medium-12 large-8 whats-new__item-wrapper"><div class="whats-new__item"><a href="{{ url }}"><div class="whats-new__item__img"><img src="{{ image }}"></div></a><legend>{{ subtitulo }}</legend><a href="{{ url }}"><h4>{{ title }}</h4></a><p>{{ date }}</p></div></div>';
                        return template.replace('{{ image }}', item.field_imagen).replace(/{{ url }}/g, item.path).replace('{{ title }}', item.titulo).replace('{{ date }}', item.field_cuando).replace('{{ subtitulo }}', item.field_subtitulo);
                    }
                };
            var view = new Drupal.filteredView(options, listado);
            console.log(view);
            // if($('.search-form').length > 0) view.onBlurTextInput();

            $('.filtered-view__load-more').click(function () {
                $(this).addClass('filtered-view__load-more--hidden');
                view.showNextPage();
                view.loadNextPage();
                $(this).blur();
            });


            $('.filtered-view-form select').change(function (e) {
                e.stopPropagation();
                view.update();
            });

            var input = $('.filtered-view-form__input--text');
            view.onBlurTextInput();

            input.focus(function () {
                view.onFocusTextInput();
            }).blur(function () {
                view.onBlurTextInput();
            }).change(function () {
                view.update();
            }).keypress(function (e) {
                if (e.which == 13) {
                    e.preventDefault();
                    $(this).blur();
                }
            });

            $('.filtered-view-form__button').click(function (e) {
                e.preventDefault();
                if (!$(this).hasClass('filtered-view-form__button--clear')) return;
                input.val('');
                $(this).removeClass('filtered-view-form__button--clear');
                view.update();
            });


            $('.filtered-view-tabs input').change(function () {
                view.filterByTab($(this).val());
            });

            $('.filtered-view__reset').click(function () {
                $('.filtered-view-form select,.filtered-view-form input').val('');
                view.loadNextPage(true);
                view.onBlurTextInput();
                $(this).blur();
            });
        }
    };


})
(jQuery, Drupal);


