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


if (people_data)
    (function ($, Drupal, JSON, people_data) {
        Drupal.people = {};
        Drupal.people.searchResult = people_data;
        Drupal.people.byLetter = {};
        Drupal.people.byLetter['a-e'] = '[starts-with(surname, "A") or starts-with(surname, "B") or starts-with(surname, "C") or starts-with(surname, "D") or starts-with(surname, "E")]';
        Drupal.people.byLetter['f-j'] = '[starts-with(surname, "F") or starts-with(surname, "G") or starts-with(surname, "H") or starts-with(surname, "I") or starts-with(surname, "J")]';
        Drupal.people.byLetter['k-o'] = '[starts-with(surname, "K") or starts-with(surname, "L") or starts-with(surname, "M") or starts-with(surname, "N") or starts-with(surname, "O")]';
        Drupal.people.byLetter['p-t'] = '[starts-with(surname, "P") or starts-with(surname, "Q") or starts-with(surname, "R") or starts-with(surname, "S") or starts-with(surname, "T")]';
        Drupal.people.byLetter['u-z'] = '[starts-with(surname, "U") or starts-with(surname, "V") or starts-with(surname, "W") or starts-with(surname, "Y") or starts-with(surname, "X") or starts-with(surname, "Z")]';

        Drupal.people.search = function (data, filters) {
            var conditions = [];
            var query = '';

            if (filters.role) conditions.push('role="' + filters.role + '"');
            if (filters.area) conditions.push('areas="' + filters.area + '"');
            if (filters.sector) conditions.push('areas="' + filters.sector + '"');
            if (filters.name) conditions.push('contains(name,"' + filters.name + '")');

            if (conditions.length > 0) {
                query = '[' + conditions.join(' and ') + ']';
            } else {
                Drupal.people.searchResult = data;
                return data;
            }

            var result = JSON.search(data, '//*' + query);
            Drupal.people.searchResult = result;
            return result;
        };

        Drupal.people.filterByLetter = function (data, filter) {
            var query = '';
            switch (filter) {
                case 'a-e':
                    query = Drupal.people.byLetter['a-e'];
                    break;
                case 'f-j':
                    query = Drupal.people.byLetter['f-j'];
                    break;
                case 'k-o':
                    query = Drupal.people.byLetter['k-o'];
                    break;
                case 'p-t':
                    query = Drupal.people.byLetter['p-t'];
                    break;
                case 'u-z':
                    query = Drupal.people.byLetter['u-z'];
                    break;
                default:
                    return data;
            }
            var filtered = JSON.search(data, '//*' + query);
            return filtered;
        };

        Drupal.people.checkByLetter = function (data) {
            Object.keys(Drupal.people.byLetter).forEach(function (key) {
               var results =  Drupal.people.filterByLetter(data,key);
                $('.tabs-selector__tab[value='+key+']').prop('disabled',results.length<=0);
            });
        };

        Drupal.behaviors.people_form = {
            attach: function (context, settings) {
                $('#our-people-form').change(function () {
                    var filters = $(this).serializeObject();
                    var results = Drupal.people.search(people_data, filters);
                    $('#by-letter-view-all').prop('checked', true);
                    $('#by-letter-view-all').trigger('change');
                    Drupal.people.updateSearch(results);
                    Drupal.people.checkByLetter(results);
                    var count = results.length > 0 ? results.length : 'No';
                    count+= results.length == 1 ? ' result' : ' results';
                    $('.tabs-selector').toggle(results.length>0);
                    $('.people-grid__count span').text(count);
                    $('.people-grid__count').removeClass('people-grid__count--hidden');
                });

                $('#our-people-tabs .tabs-selector__tab').change(function () {
                    var value = $(this).val();
                    var filtered = Drupal.people.filterByLetter(Drupal.people.searchResult, value);
                    Drupal.people.updateSearch(filtered);
                });

                $('.people-grid__reset').click(function(){
                    $('#our-people-form select,#our-people-form inpput').val('');
                    Drupal.people.updateSearch(people_data);
                    $('.people-grid__count').addClass('people-grid__count--hidden');
                    $('.tabs-selector').show();
                    $('.tabs-selector__tab').prop('disabled',false);
                    $('#by-letter-view-all').prop('checked', true);
                    $('#by-letter-view-all').trigger('change');
                });

                $.typeahead({
                    input: '#our-people-form-by-name',
                    cancelButton: false,
                    source: {
                        data: JSON.search(people_data, '//*/name')
                    },
                    callback: {
                        onInit: function (node) {
                            //console.log('Typeahead Initiated on ' + node.selector);
                        }
                    }
                });

                Drupal.people.updateSearch(people_data);

            }
        };

        Drupal.people.updateSearch = function (data) {
            var grid = $('.people-grid');
            grid.addClass('people-grid--hidden');
            setTimeout(function () {
                grid.empty();
                var template = '<div class="column medium-8 large-6 people-grid__item"><a href="{{ path }}">{{ image }}<h4>{{ name }}</h4></a><p>{{ position }}</p></div>';
                data.forEach(function (person) {
                    var item = template.replace('{{ image }}', person.image).replace('{{ path }}', person.path).replace('{{ name }}', person.name).replace('{{ position }}', person.position);
                    grid.append(item);
                });
                grid.removeClass('people-grid--hidden');
            }, 300);
        }


    })
    (jQuery, Drupal, JSON, people_data);

