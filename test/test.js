var assert = require('chai').assert;
var jsdom = require('mocha-jsdom');

var template = {
    default: '<div id="collapse">'+
        '<a href="#drawer1" data-bind="#collapse" data-role="handle" class="is-open"></a>'+
        '<div id="drawer1" data-bind="#collapse" data-role="drawer" class="is-open"></div>'+
        '<a href="#drawer2" data-bind="#collapse" data-role="handle" id="handle2"></a>'+
        '<div id="drawer2" data-bind="#collapse" data-role="drawer"></div>'+
    '</div>',
    activeClass: '<div id="collapse" data-active-class="foo-bar">'+
        '<a href="#drawer1" data-bind="#collapse" data-role="handle"></a>'+
        '<div id="drawer1" data-bind="#collapse" data-role="drawer"></div>'+
        '<a href="#drawer2" data-bind="#collapse" data-role="handle" id="handle2"></a>'+
        '<div id="drawer2" data-bind="#collapse" data-role="drawer"></div>'+
    '</div>'
}

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

        it('should have added plugin to jQuery\'s prototype', function () {
            assert.isDefined( $.fn.collapse );
        });

    });

    describe('instantiation', function () {

        var inst;

        before(function ( done ) {
            document.body.innerHTML = template.default;
            inst = $('#collapse').collapse();
            done();
        });

        it('should add \'role="tablist"\' to source element', function () {
            var collapse = document.getElementById('collapse');
            assert.match( collapse.getAttribute('role'), /tablist/ );
        });

        it('should add \'aria-multiselectable="true"\' to source element', function () {
            var collapse = document.getElementById('collapse');
            assert.match( collapse.getAttribute('aria-multiselectable'), /true/ );
        });

        it('should add \'role="tab"\' to each "handle" element', function () {
            var handles = document.querySelectorAll('a');
            var roles = handles[0].getAttribute('role')+handles[1].getAttribute('role');
            assert.match( roles, /tabtab/ );
        });

        it('should add \'aria-controls="[drawerID]"\' to each handle', function () {
            var handles = document.querySelectorAll('a');
            var controls = '';
            for( var i=0; i<handles.length; i++ ) {
                controls += handles[i].getAttribute('aria-controls');
            }
            assert.match( controls, /drawer1drawer2/ );
        });

        it('should add \'role="tabpanel"\' to each "drawer" element', function () {
            var drawers = document.querySelectorAll('[data-role="drawer"]');
            var roles = drawers[0].getAttribute('role')+drawers[1].getAttribute('role');
            assert.match( roles, /tabpaneltabpanel/ );
        });

        it('should add \'aria-labelledby="[handleID]"\' to each drawer', function () {
            var drawers = document.querySelectorAll('[data-role="drawer"]');
            var labelledby = '';
            for( var i=0; i<drawers.length; i++ ) {
                labelledby += drawers[i].getAttribute('aria-labelledby');
            }
            assert.match( labelledby, /drawer1-handlehandle2/ );
        });

        it('should find and save id of any active handles/drawers on load', function () {
            assert.lengthOf( inst.activeDrawers, 1 );
        });

        it('should add \'aria-expanded\' to every drawer and handle', function () {
            var both = document.querySelectorAll('[data-role]');
            var expanded = '';
            for( var i=0; i<both.length; i++ ) {
                expanded += both[i].getAttribute('aria-expanded');
            }
            assert.match( expanded, /truetruefalsefalse/ );
        });

    });

    describe('settings', function () {

        it('should be able to update \'activeClass\' setting from instantiation', function () {
            document.body.innerHTML = template.default;
            $('#collapse').collapse({activeClass:'foo-bar'}).openDrawer('drawer1');
            assert.match( document.querySelector('a').className, /foo-bar/ );
        });

        it('should be able to update \'activeClass\' setting from html', function () {
            document.body.innerHTML = template.activeClass;
            $('#collapse').collapse().openDrawer('drawer1');
            assert.match( document.querySelector('a').className, /foo-bar/ );
        });

        it('should only let one drawer open at a time with \'accordian\' set to true', function () {
            document.body.innerHTML = template.default;
            var inst = $('#collapse').collapse({accordian:true});
            var container = document.getElementById('collapse');
            var drawer1 = container.children[0].className + container.children[1].className;
            var drawer2 = container.children[2].className + container.children[3].className;
            assert.match( drawer1, /(is-open){2}/ );
            assert.lengthOf( drawer2, 0 );
            inst.openDrawer('drawer2');
            var drawer1 = container.children[0].className + container.children[1].className;
            var drawer2 = container.children[2].className + container.children[3].className;
            assert.lengthOf( drawer1, 0 );
            assert.match( drawer2, /(is-open){2}/ );
        });

        it('should be able to add function to onInit setting', function () {
            document.body.innerHTML = template.default;
            var inst = $('#collapse').collapse({
                onInit: function() {
                    this.test = "foo";
                }
            });
            assert.match( inst.test, /foo/ );
        });

        it('should be able to add function to onOpen setting', function () {
            document.body.innerHTML = template.default;
            var inst = $('#collapse').collapse({
                onOpen: function() {
                    this.test = "bar";
                }
            });
            inst.openDrawer('drawer2');
            assert.match( inst.test, /bar/ );
        });

        it('should be able to add function to onOpen setting', function () {
            document.body.innerHTML = template.default;
            var inst = $('#collapse').collapse({
                onClose: function() {
                    this.test = "foobar";
                }
            });
            inst.closeDrawer('drawer1');
            assert.match( inst.test, /foobar/ );
        });

    });

    describe('openDrawer()', function () {

        it('should add newly opened drawer to list of open drawers', function () {
            document.body.innerHTML = template.default;
            var inst = $('#collapse').collapse();
            inst.openDrawer('drawer2');
            assert.lengthOf( inst.activeDrawers, 2 );
            assert.include( inst.activeDrawers, 'drawer2' );
        });

        it('should add \'activeClass\' to newly opened drawer and handle', function () {
            document.body.innerHTML = template.default;
            var inst = $('#collapse').collapse();
            inst.openDrawer('drawer2');
            var drawer2 = inst.pairsByDrawer.drawer2;
            assert.match( drawer2[0].className + drawer2[1].className, /(is-open){2}/ );
        });

        it('should change aria-expanded attribute on handle and drawer elements', function () {
            document.body.innerHTML = template.default;
            var inst = $('#collapse').collapse();
            var handle2 = document.querySelector('a[href="#drawer2"]').getAttribute('aria-expanded');
            var drawer2 = document.querySelector('#drawer2').getAttribute('aria-expanded');
            assert.match( handle2+drawer2, /(false){2}/ );
            inst.openDrawer('drawer2');
            var handle2 = document.querySelector('a[href="#drawer2"]').getAttribute('aria-expanded');
            var drawer2 = document.querySelector('#drawer2').getAttribute('aria-expanded');
            assert.match( handle2+drawer2, /(true){2}/ );
        });

        it('should not run anything if drawer is already open', function () {
            document.body.innerHTML = template.default;
            var inst = $('#collapse').collapse();
            inst.openDrawer('drawer1', function(){
                this.test = "foo";
            });
            assert.isUndefined( inst.test );
        });

        it('should run callback function from parameter', function () {
            document.body.innerHTML = template.default;
            var inst = $('#collapse').collapse();
            inst.openDrawer('drawer2', function(){
                this.test = "foo";
            });
            assert.match( inst.test, /foo/ );
        });

    });

    describe('closeDrawer()', function () {

        it('should remove newly close drawer from list of open drawers', function () {
            document.body.innerHTML = template.default;
            var inst = $('#collapse').collapse();
            inst.closeDrawer('drawer1');
            assert.lengthOf( inst.activeDrawers, 0 );
        });

        it('should remove \'activeClass\' from newly closed drawer and handle', function () {
            document.body.innerHTML = template.default;
            var inst = $('#collapse').collapse();
            inst.closeDrawer('drawer1');
            var drawer1 = inst.pairsByDrawer.drawer1;
            assert.lengthOf( drawer1[0].className + drawer1[1].className, 0 );
        });

        it('should change aria-expanded attribute on handle and drawer elements', function () {
            document.body.innerHTML = template.default;
            var inst = $('#collapse').collapse();
            var handle1 = document.querySelector('a[href="#drawer1"]').getAttribute('aria-expanded');
            var drawer1 = document.querySelector('#drawer1').getAttribute('aria-expanded');
            assert.match( handle1+drawer1, /(true){2}/ );
            inst.closeDrawer('drawer1');
            var handle1 = document.querySelector('a[href="#drawer1"]').getAttribute('aria-expanded');
            var drawer1 = document.querySelector('#drawer1').getAttribute('aria-expanded');
            assert.match( handle1+drawer1, /(false){2}/ );
        });

        it('should not run anything if drawer is already closed', function () {
            document.body.innerHTML = template.default;
            var inst = $('#collapse').collapse();
            inst.closeDrawer('drawer2', function(){
                this.test = "foo";
            });
            assert.isUndefined( inst.test );
        });

        it('should run callback function from parameter', function () {
            document.body.innerHTML = template.default;
            var inst = $('#collapse').collapse();
            inst.closeDrawer('drawer1', function(){
                this.test = "foo";
            });
            assert.match( inst.test, /foo/ );
        });

    });

    describe('toggleDrawer()', function () {

        var inst;

        before(function ( done ) {
            document.body.innerHTML = template.default;
            inst = $('#collapse').collapse();
            done();
        });

        it('should open drawer if closed', function () {
            inst.toggleDrawer('drawer2');
            assert.lengthOf( inst.activeDrawers, 2 );
            assert.include( inst.activeDrawers, 'drawer2' )
        });

        it('should close drawer if open', function () {
            inst.toggleDrawer('drawer1');
            assert.lengthOf( inst.activeDrawers, 1 );
            assert.include( inst.activeDrawers, 'drawer2' )
        });

    });

    describe('drawerIsOpen()', function () {

        var inst;

        before(function ( done ) {
            document.body.innerHTML = template.default;
            inst = $('#collapse').collapse();
            done();
        });

        it('should return true if drawer is open', function () {
            assert.isTrue( inst.drawerIsOpen('drawer1') );
        });

        it('should return false if drawer is closed', function () {
            assert.isFalse( inst.drawerIsOpen('drawer2') );
        });

    });

});
