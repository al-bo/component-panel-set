/**
 * @license The MIT License (MIT)
 * @copyright Boris Aleynikov <aleynikov.boris@gmail.com>
 */

/* eslint no-path-concat: 0 */

'use strict';

var Component = require('stb-component'),
    keys      = require('stb-keys');

/**
 * Magsdk panel set implementation
 *
 * @param {Object} [config={}] init parameters (all inherited from the parent)
 * @param {Array} [config.panels] array of panels to use
 * @param {Array} [config.focusIndex=0] focus panel index
 * @constructor
 * @extends Component
 */
function PanelSet ( config ) {
    var self = this,
        index;

    config = config || {};

    if ( DEVELOP ) {
        if ( typeof config !== 'object' ) {
            throw new Error(__filename + ': wrong config type');
        }
        // init parameters checks
        if ( 'className' in config && (!config.className || typeof config.className !== 'string') ) {
            throw new Error(__filename + ': wrong or empty config.className');
        }
        if ( config.panels && !Array.isArray(config.panels) || !config.panels.length ) {
            throw new Error(__filename + ': wrong config.panels type');
        }
    }

    // can't accept focus
    config.focusable = config.focusable || false;

    // set default className if classList property empty or undefined
    //config.className = 'panelSet ' + (config.className || '');

    // parent constructor call
    Component.call(this, config);

    this.panels = config.panels;

    /**
     * Index of current active panel
     *
     * @type {number}
     */
    this.focusIndex = 0;

    // set special panels classes
    if ( config.panels && !config.panels[0].main ) {
        config.panels[0].$node.classList.add('left');
        // small resolution special class
        config.panels[0].$node.classList.add('expand');
    }

    if (  config.panels && config.panels[1] && config.panels[1].main ) {
        // small resolution special class
        config.panels[1].$node.classList.add('position-right');
    }

    if ( config.panels && config.panels[2] && config.panels[1].main ) {
        config.panels[2].$node.classList.add('right');
    }

    // add panels
    if ( config.panels ) {
        this.add.apply(this, config.panels);
    }

    // panel keydown handler to set focus panel
    function keydownHandler ( event ) {
        switch ( event.code ) {
            case keys.left:
                if ( self.focusIndex > 0 ) {
                    self.panels[self.focusIndex - 1].focus();
                }
                break;
            case keys.right:
                if ( self.focusIndex < self.panels.length - 1 ) {
                    self.panels[self.focusIndex + 1].focus();
                }
                break;
        }
    }

    // add special listener
    for ( index = 0; index < this.panels.length; index++ ) {
        this.panels[index].addListeners({
            keydown: keydownHandler
        });
        // set panels indexes
        this.panels[index].index = index;
    }

    /*if ( config.focusIndex && config.focusIndex < this.panels.length ) {
     this.panels[config.focusIndex].focus();
     } else {
     if ( config.panels.length > 1 ) {
     this.panels[1].focus();
     } else {
     this.panels[0].focus();
     }
     }*/
}

PanelSet.prototype = Object.create(Component.prototype);
PanelSet.prototype.constructor = PanelSet;

// set component name
PanelSet.prototype.name = 'mag-component-panel-set';


/**
 *
 */
PanelSet.prototype.focus = function () {
    Component.prototype.focus.call(this);
    this.panels[this.focusIndex].focus();
};

/**
 *
 */
PanelSet.prototype.blur = function () {
    this.panels[this.focusIndex].blur();
};

module.exports = PanelSet;
