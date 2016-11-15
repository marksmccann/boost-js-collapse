Boost JS Collapse
==================================================
A style-free collapse plugin for jQuery and [Boost JS](https://github.com/marksmccann/boost-js). While other plugins style and arrange your handles and drawers for you, this plugin only handles the functionality, leaving the layout and styling up to you.


Installation
--------------------------------------
Install with npm:
```bash
npm install boost-js-collapse
```
Install in browser:
```html
<script src="https://cdn.rawgit.com/marksmccann/boost-js-collapse/master/dist/collapse.min.js"></script>
```

Usage
--------------------------------------

### Create Plugin
```javascript
var boost = require('boost-js');
// var boost = $.fn.boost; (browser install)

var collapse = require('boost-js-collapse');
// var collapse = $.fn.boost.collapse; (browser install)

$.fn.collapse = boost( collapse.plugin, collapse.defaults );
```

### Markup Structure
```html
<div id="collapse">
    <a href="#drawer1" data-bind="#collapse" data-role="handle">Handle 1</a>
    <div id="drawer1" data-bind="#collapse" data-role="drawer">Drawer 1</div>
    <a href="#drawer2" data-bind="#collapse" data-role="handle">Handle 2</a>
    <div id="drawer2" data-bind="#collapse" data-role="drawer">Drawer 2</div>
</div>
```
*Note: `data-bind` is used to link the element to the instance, `data-role` is used to define the element's role in that instance. See [Boost JS](https://github.com/marksmccann/boost-js) for more details.*

### Instantiate Plugin
```javascript
$('#collapse').collapse();
```

Options
--------------------------------------
Name | Default | Description
--- | --- | ---
accordian | `false` | when true, will only open one drawer at a time
activeClass | `"is-open"` | the class added to handle and drawer when active
onOpen | `null` | a callback function called when any drawer opens
onClose | `null` | a callback function called when any drawer closes
onInit | `null` | a callback function called when plugin is intialized
### Usage
```javascript
$('#collapse').collapse({
	onInit: function() {
    	console.log( this.id ); // 'collapse'
    }
});
```
\- or -
```html
<div id="collapse" data-accordian="true">...</div>
```

API
--------------------------------------
### openDrawer( 'drawerID', callback )
Open a drawer by providing the desired panel's id. Optional `callback` function called after opening. If drawer is already open, callback will not be run.
```javascript
instance.openDrawer( 'drawer2', function(){
    console.log("Drawer 2 is now open.");
});
```
### closeDrawer( 'drawerID', callback )
Close a drawer by providing the desired drawer's id. Optional `callback` function called after closing. If drawer is already closed, callback will not be run.
```javascript
instance.closeDrawer( 'drawer2', function(){
    console.log("Drawer 2 is now closed.");
});
```
### toggleDrawer( 'drawerID', callback )
Will toggle a given drawer open or close. Optional `callback` function called whether opened or closed.
```javascript
instance.toggleDrawer( 'drawer2' );
```
### drawerIsOpen( 'drawerID', callback )
Determine whether a given drawer is open or not.
```javascript
instance.drawerIsOpen( 'drawer2' ); // true or false
```
### activeDrawers
The ids of the currently active drawers in an array
```
instance.activeDrawers // [ drawer1, drawer2 ... ]
```
### pairsByDrawer
Each handle and corresponding drawer grouped into a jquery object and organized by drawer id.
```
instance.pairsByDrawer // { drawer1: $( 0:handle1, 1:drawer1 ), ... }
```


Running Tests
--------------------------------------

```bash
$ npm install && npm test
```


License
--------------------------------------

Copyright © 2016, [Mark McCann](https://github.com/marksmccann).
Released under the [MIT license](LICENSE).
