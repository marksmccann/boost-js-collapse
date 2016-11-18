/**
 * Boost JS Collapse
 * A style-free collapse plugin for jQuery and Boost JS
 * @author Mark McCann (www.markmccann.me)
 * @license MIT
 * @version 0.0.1
 * @requires jQuery, boost-js
 */

(function(){

    var Collapse = function() {
        var inst = this;
        // each handle and drawer pair organized by drawer id
        inst.pairsByDrawer = {};
        inst.roles.handle.each(function(){
            // get the id from the handle's 'href'
            var id = $(this).attr('href').replace(/^#/,'');
            // get the corresponding drawer with the id
            var $drawer = inst.roles.drawer.filter('#'+id);
            // combine the matching hadnle and drawer into one jQuery object
            inst.pairsByDrawer[ id ] = $drawer.add(this);
        });
        // add attributes to key elements to make application for accessible
        // add role="tablist" to source element
        inst.source.attr('role','tablist');
        // if more than one can be open at once, add aria-multiselectable
        if(!inst.settings.accordian) {
            inst.source.attr('aria-multiselectable', 'true');
        }
        // add role="tab" and aria-controls="[targetID]" to each handle
        inst.roles.handle.attr('role','tab').each(function(){
            $(this).attr('aria-controls',$(this).attr('href').replace(/^#/,''));
        });
        // add role="tabpanel" to every drawer
        inst.roles.drawer.attr('role','tabpanel');
        // add aria-labelledby="[handleID]" to each drawer
        // if handle does not have an id, create a new one and add it to handle
        for( var k in inst.pairsByDrawer ) {
            var handle = inst.pairsByDrawer[k][0], drawer = inst.pairsByDrawer[k][1];
            var id = handle.id.length === 0 ? drawer.id+'-handle' : handle.id;
            $(drawer).attr('role','tabpanel').attr('aria-labelledby',id);
            $(handle).attr('id', id);
        }
        // locate any currently active handle and store it's target id
        inst.activeDrawers = [];
        inst.roles.handle.filter( '.'+this.settings.activeClass ).each(function(){
            inst.activeDrawers.push( $(this).attr('href').replace(/^#/,'') );
        });
        // add all handles and drawers aria-expanded attribute to false
        inst.roles.handle.add(inst.roles.drawer).attr( 'aria-expanded', 'false' );
        // change all active handles/drawers to expanded true
        inst.activeDrawers.forEach(function(id){
            inst.pairsByDrawer[id].attr( 'aria-expanded', 'true' );
        });
        // change drawer when handle is clicked
        inst.roles.handle.on( 'click', function(e){
            e.preventDefault();
            inst.toggleDrawer( $(this).attr('href').replace(/^#/,'') );
        });
        // run onInit callback
        if( $.isFunction(inst.settings.onInit) ) inst.settings.onInit.call(inst);
    }

    Collapse.prototype = {
        /**
         * changes the active state of a handle and its corresponding
         * drawer to open with the id of the panel wanted to be changed to
         * @param {string} id the id of the drawer
         * @param {function} callback
         * @return {object} instance
         */
        openDrawer: function( id, callback ) {
            // local instance
            var inst = this;
            // make sure this drawer isn't already open
            if( inst.activeDrawers.indexOf(id) === -1 ) {
                // close open drawers when this one is opened
                if( inst.settings.accordian ) {
                    inst.activeDrawers.forEach(function( id ){
                        inst.closeDrawer(id);
                    });
                }
                // add the active class to the new handle and drawer
                inst.pairsByDrawer[ id ].addClass( inst.settings.activeClass );
                // update accessibility attributes
                inst.pairsByDrawer[ id ].attr( 'aria-expanded', 'true' );
                // change focus to handle
                inst.pairsByDrawer[ id ].first()[0].focus();
                // add newly opened drawer to active list
                inst.activeDrawers.push(id);
                // run callbacks
                if( $.isFunction(callback) ) callback.call(inst);
                if( $.isFunction(inst.settings.onOpen) ) inst.settings.onOpen.call(inst);
            }
            // return instance
            return inst;
        },
        /**
         * changes the active state of a handle and its corresponding
         * drawer to closed with the id of the panel wanted to be changed to
         * @param {string} id the id of the drawer
         * @param {function} callback
         * @return {object} instance
         */
        closeDrawer: function( id, callback ) {
            // local instance
            var inst = this;
            // make sure this drawer is already open
            if( inst.activeDrawers.indexOf(id) > -1 ) {
                // remove the active class from the handle and drawer
                inst.pairsByDrawer[ id ].removeClass( inst.settings.activeClass );
                // update accessibility attributes
                inst.pairsByDrawer[ id ].attr( 'aria-expanded', 'false' );
                // change focus to handle
                inst.pairsByDrawer[ id ].first()[0].focus();
                // remove drawer from active list
                inst.activeDrawers.splice(inst.activeDrawers.indexOf(id), 1);
                // run callbacks
                if( $.isFunction(callback) ) callback.call(inst);
                if( $.isFunction(inst.settings.onClose) ) inst.settings.onClose.call(inst);
            }
            // return instance
            return inst;
        },
        /**
         * toggles a given drawer open or closed
         * @param {string} id the id of the drawer
         * @param {function} callback
         * @return {object} instance
         */
        toggleDrawer: function( id, callback ) {
            return this.drawerIsOpen(id)
                ? this.closeDrawer( id, callback )
                : this.openDrawer( id, callback );
        },
        /**
         * determines if a given drawer is open or not
         * @param {string} id the id of the drawer
         * @return {object} instance
         */
        drawerIsOpen: function( id ) {
            return this.activeDrawers.indexOf(id) > -1;
        }
    }

    var plugin = {
        plugin: Collapse,
        defaults: {
            accordian: false,
            activeClass: 'is-open',
            onOpen: null,
            onClose: null,
            onInit: null
        }
    }

    // if node, return via module.exports
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        module.exports = plugin;
    // otherwise, save object to jquery globally
    } else if( typeof window !== 'undefined' && typeof window.$ !== 'undefined' && typeof window.$.fn.boost !== 'undefined' ) {
        window.$.fn.boost.collapse = plugin;
    }

})();
