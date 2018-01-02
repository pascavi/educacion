/**
 * Created by Pascual on 12/02/2017.
 */


var chai = require('chai'),
    expect = chai.expect,
    jsdom = require('jsdom'),
    fs = require('fs');

var jquery = fs.readFileSync('node_modules/jquery/dist/jquery.js').toString();
var drupal = 'var Drupal = {};';
var defiant = fs.readFileSync('js/defiant.js').toString();
var data = fs.readFileSync('tests/people-data.js').toString();
var people = fs.readFileSync('js/people.js').toString();



describe('People search', function () {
    var $,Drupal, JSON, profiles;

    before(function () {
        jsdom.env({
            html: '<html><head></head><body></body></html>',
            src: [jquery,defiant,drupal,data,people],
            done: function (err, win) {

                $ =  win.jQuery;
                Drupal = win.Drupal;
                //console.log(win.JSON);
                JSON = win.JSON;
                profiles = win.profiles;

            },
        });
    });

    it('empty search returns all profiles', function () {
        var filters = {}
        var result = Drupal.people.search(profiles, filters);
        expect(result.length).to.equal(53);//
    });

    it('search by role', function () {
        var filters = {role:29};
        var result = Drupal.people.search(profiles, filters);
        expect(result.length).to.equal(24);
    });

    it('search by area', function () {
        var filters = {area:4};
        var result = Drupal.people.search(profiles, filters);
        expect(result.length).to.equal(20);
    });

    it('search by area and role', function () {
        var filters = {area:4,role: 29};
        var result = Drupal.people.search(profiles, filters);
        expect(result.length).to.equal(7);
    });

    it('search by name', function () {
        var filters = {name:'ona'};
        var result = Drupal.people.search(profiles, filters);
        expect(result.length).to.equal(4);
    });

    it('search by name, area and role', function () {
        var filters = {name:'ona',area:4,role: 30};
        var result = Drupal.people.search(profiles, filters);
        console.log(result);
        expect(result.length).to.equal(2);
    });


});
