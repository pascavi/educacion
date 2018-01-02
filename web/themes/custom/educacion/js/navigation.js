"use strict";

(function ($, Drupal) {
    var isTouchDevice = 'ontouchstart' in document.documentElement;

    Drupal.behaviors.menu = {
        attach: function (context, settings) {

            /* OVERLAY */

            $('.js-hide-overlay').click(function (e) {
                e.preventDefault();
                hideOverlay();
            });

            function showOverlay() {
                hideMegamenu();
                hideDropdown();
                if (isTouchDevice) $('body').addClass('no-scroll');
                $('.overlay').show();
                setTimeout(function () {
                    $('.overlay').addClass('overlay--visible');
                }, 100);
            }

            function hideOverlay() {
                if (isTouchDevice) $('body').removeClass('no-scroll');
                $('.overlay').removeClass('overlay--visible');
                collapseMobileMenu();
                setTimeout(function () {
                    $('.overlay').hide();
                }, 100);
            }


            /* SEARCH */

            $('.js-show-search').click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                showOverlay();
                $('.overlay__search').show();
                $('.overlay__menu').hide();

            });

            /* MOBILE NAVIGATION */



            $('.js-show-mobile-menu').click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                showOverlay();
                $('.overlay__menu').show();
                $('.overlay__search').hide();
            });



            $('.header__nav .menu--L0').clone()
                .append('<li class="menu-item menu-item--L0"><a href="/contact" class="menu-link--L0">Contact Us</a></li>')
                .appendTo('.overlay__menu');


            $('.overlay .js-expand-menu').click(function (e) {
                e.preventDefault();
                expandMobileMenu(this);
            });

            $('.overlay .js-collapse-menu').click(function (e) {
                e.preventDefault();
                collapseMobileMenu();
            });


            function expandMobileMenu(item) {
                $(item).parent().find('ul.menu').clone().appendTo('.overlay__submenu__links');
                $('.overlay__submenu__header').text($(item).text());
                $('.overlay__content').scrollTop(0);
                $('.overlay .menu--L0').addClass('menu--main--moved-away');
                $('.overlay__submenu').addClass('overlay__submenu--brought-in');
            }

            function collapseMobileMenu() {
                $('.overlay__submenu__links').empty();
                $('.overlay__content').scrollTop(0);
                $('.overlay .menu--L0').removeClass('menu--main--moved-away');
                $('.overlay__submenu').removeClass('overlay__submenu--brought-in');
            }

            /* HEAD DROPDOWNS */

            $('.header .js-expand-menu').click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    hideMegamenu();
                    if ($(this).hasClass('menu-link--expanded')) {
                        hideDropdown();
                        $(this).blur();

                    }
                    else {
                        showDropdown($(this).data('target'));
                    }
                }
            );

            $(".header a.menu-link--L0:not('.js-expand-menu')").focus(function (e) {
                e.preventDefault();
                hideDropdown();
            });


            function hideDropdown() {
                $('.menu-dropdown--expanded').css('top', 0);
                $('.menu-dropdown').removeClass('menu-dropdown--expanded');
                $('.menu-link--expanded').removeClass('menu-link--expanded');
                $('.menu--L0').removeClass('menu--expanded');
                $('.header').removeClass('header--has-dropdown');
                setTimeout(function () {
                    $('.header .menu-dropdown').hide();
                }, 300);
            }

            function showDropdown(target) {
                $('.menu-dropdown--expanded').css('top', 0);
                $('.menu-dropdown').hide();
                $('.menu-dropdown').removeClass('menu-dropdown--expanded');
                $('.header a[data-target=' + target + ']').addClass('menu-link--expanded');
                $('.menu--L0').addClass('menu--expanded');
                $('.header').addClass('header--has-dropdown');
                var dropdown = $('.menu-dropdown#' + target);
                $(dropdown).show();
                var delta = $('header').offset().top + $('header').outerHeight() - $('.header__nav').offset().top;
                setTimeout(function () {
                    $(dropdown).css('top', delta + 'px');
                    $(dropdown).addClass('menu-dropdown--expanded');
                }, 100);
            }

            /* MEGAMENU */

            $('.header a.js-expand-megamenu').click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                var _this = this;
                hideDropdown();
                if ($('.megamenu').is(':visible')) {
                    hideMegamenu();
                    _this.blur();
                } else {
                    showMegamenu();
                }
            });

            $(".header a.menu-link--L0:not('.js-expand-megamenu')").focus(function (e) {
                e.preventDefault();
                hideMegamenu();
            });


            function hideMegamenu() {
                $('.megamenu').removeClass('megamenu--expanded');
                //$('.menu-link--expanded').removeClass('menu-link--expanded');
                $('.menu--L0').removeClass('menu--expanded');
                setTimeout(function () {
                    $('.megamenu').hide();
                }, 300);
            }

            function showMegamenu() {
                $('.header .megamenu').show();
                $('a.js-expand-megamenu').addClass('menu-link--expanded');
                $('.menu--L0').addClass('menu--expanded');
                setTimeout(function () {
                    $('.header .megamenu').addClass('megamenu--expanded');
                }, 100);
            }


//escape actions

            $('.overlay').click(function (e) {
                e.stopPropagation();
            });

            $(document).keyup(function (e) {
                if (e.keyCode === 27) {
                    clearAllOverlays();
                }
            });

            $(document).click(clearAllOverlays);
            /*$(document).touch(clearAllOverlays);*/

            function clearAllOverlays() {
                hideOverlay();
                hideMegamenu();
                hideDropdown();
            }

        }


    };
})
(jQuery, Drupal);