var assert = require('chai').assert;
var jsdom = require('mocha-jsdom');

var template = {}

describe('Boost JS Tabs', function () {

    jsdom()

    before(function ( done ) {
        $ = require('jquery')
        boost = require('boost-js')
        collapse = require('../dist/collapse.min.js')
        $.fn.collapse = boost( collapse.plugin, collapse.defaults );
        done();
    });

    describe('creation', function () {

    });

    describe('instantiation', function () {

    });

    describe('settings', function () {

    });

    describe('openDrawer()', function () {

    });

    describe('closeDrawer()', function () {

    });

    describe('toggleDrawer()', function () {

    });

    describe('drawerIsOpen()', function () {

    });

});
