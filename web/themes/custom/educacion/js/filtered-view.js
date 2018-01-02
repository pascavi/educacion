(function ($, Drupal) {

    Drupal.filteredView = function (options, first_page) {
  console.log('test');
        this.options = options;
        this.tabs = {'a-e': [], 'f-j': [], 'k-o': [], 'p-t': [], 'u-z': []};
        this.data = [];
        var _this = this;
        Object.keys(options).forEach(function (key, index) {
            _this[key] = options[key];
        });

        this.renderNextPage(first_page);
        this.showNextPage();
        this.loadNextPage();  //prepare next page
        this.checkTabs(first_page);
        this.updateCount(first_page);
    };

    Drupal.filteredView.prototype.update = function () {
        $('.filtered-view').css('opacity', 0.5);
        this.loadNextPage(true); // reset = true;
    };


    Drupal.filteredView.prototype.renderNextPage = function (data, reset) {
        if (!data) return;
        if (reset) $('.filtered-view').empty().css('opacity', 1);
        var n = $('.' + this.page_class).length;
        var _this = this;

        var page = $('<div class="filtered-view__page filtered-view__page--hidden"></div>').addClass('filtered-view__page--' + n).hide();

        data.forEach(function (item) {            
            page.append(_this.renderItem(item));
        });

        $('.filtered-view').append(page);
    };

    Drupal.filteredView.prototype.showNextPage = function () {
        var page = $('.filtered-view__page:last-child');
        page.show();
        setTimeout(function () {
            page.removeClass('filtered-view__page--hidden');
        }, 100);
    };

    Drupal.filteredView.prototype.checkTabs = function (data) {
        if ($('.filtered-view-tabs').length <= 0) return;
        var _this = this;
        this.tabs = {'a-e': [], 'f-j': [], 'k-o': [], 'p-t': [], 'u-z': []};

        data.forEach(function (item) {
            var title = item.title || item.surname;
            if (!title) return; else title = title.toLowerCase();
            if (title.match(/^[a-e].+/i)) _this.tabs['a-e'].push(item);
            if (title.match(/^[f-j].+/i)) _this.tabs['f-j'].push(item);
            if (title.match(/^[k-o].+/i)) _this.tabs['k-o'].push(item);
            if (title.match(/^[p-t].+/i)) _this.tabs['p-t'].push(item);
            if (title.match(/^[u-z].+/i)) _this.tabs['u-z'].push(item);
        });

        this.tabs['all'] = data;

        Object.keys(this.tabs).forEach(function (key, index) {
            $('.tabs-selector__tab[value=' + key + ']').prop('disabled', _this.tabs[key].length <= 0);
        });
    };

    Drupal.filteredView.prototype.filterByTab = function (value) {
        var filtered = this.tabs[value] ? this.tabs[value] : this.tabs['all'];
        this.renderNextPage(filtered, true);
        this.showNextPage();
    };

    Drupal.filteredView.prototype.updateCount = function (data) {
        var div = $('.filtered-view__count');
        if (div.length <= 0) return;
        var count = data.length;
        if (data && data[0] && data[0].total) count = data[0].total;
        var message = '';
        if (count > 0) message = count + (count == 1 ? ' result' : ' results');
        else message = 'No results were found';

        var filters = this.getFilters();
        var keyword = filters.keyword;
        if (keyword) keyword = "for '" + keyword + "'";

        $('.filtered-view-tabs').toggle(data.length > 0);

        var isFiltered = Object.keys(filters).length > 0;


        if (!isFiltered) {
            div.addClass('filtered-view__count--hidden');
        } else {
            div.find('span.filtered-view__count-results').text(message);
            if (keyword) div.find('span.filtered-view__count-for').html(keyword);
            $('.filtered-view__count').removeClass('filtered-view__count--hidden');
        }


    };

    Drupal.filteredView.prototype.loadNextPage = function (reset) {
        var filters = this.getFilters();
        var _this = this;

        filters.page = reset ? 0 : $('.filtered-view__page').length;
        $('.filtered-view__load-more').addClass('filtered-view__load-more--hidden');
        $.getJSON(this.options.apiUrl, filters, function (data) {
            _this.renderNextPage(data, reset);
            if (!reset && data.length > 0)
                $('.filtered-view__load-more').removeClass('filtered-view__load-more--hidden');
            if (reset) {
                _this.showNextPage();
                _this.loadNextPage();
                _this.checkTabs(data);
                _this.updateCount(data);
            }
        });
    };

    Drupal.filteredView.prototype.getFilters = function () {
        var filters = this.serializeForm($('.filtered-view-form'));
        if (filters.date) {
            filters['date_min'] = filters.date + '-01-01';
            filters['date_max'] = filters.date + '-12-31';
        }
        return filters;
    }

    Drupal.filteredView.prototype.serializeForm = function (form) {
        form = $(form);
        var o = {};
        var a = form.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                if (this.value != '')
                    o[this.name] = this.value || '';
            }
        });
        return o;
    }

    Drupal.filteredView.prototype.onBlurTextInput = function () {
        var input = $('.filtered-view-form__input--text');
        var button = $('.filtered-view-form__button');
        var value = input.val();
        setTimeout(function () {
            button.toggleClass('filtered-view-form__button--clear', value > '');
        }, 100);
    };

    Drupal.filteredView.prototype.onFocusTextInput = function () {
        $('.filtered-view-form__button').removeClass('filtered-view-form__button--clear');
    };
})
(jQuery, Drupal);
