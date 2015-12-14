/**
 * colorspectre v0.1.0
 * An improved color-picker sans-jQuery based on Spectrum.
 *
 * It based on an awesome color picker called Spectrum.js (https://github.com/bgrins/spectrum)
 * However, Colorspectre, while keeping core implementation same as Spectrum, is much improved
 * version of Spectrum; No dependency on jQuery, Light-weight UI and fully CommonJS compliant.
 *
 * Author: Kushal Pandya <kushalspandya@gmail.com> (https://doublslash.com)
 * Date: 11 December, 2015
 *
 * Main Colorspectre Script.
 */

(function() {
    "use strict";
    var self = this,
        hasRequire = (typeof require !== 'undefined'),
        old_colorspectre = self.colorspectre,
        colorspectre;

    /**
     * Basic Underscore Utility Functions.
     */
    var _ = {
        /**
         * Extend an object into another object
         */
        extend: function() {
            var key, i;

            for (i = 1; i < arguments.length; i++)
            {
                for (key in arguments[i])
                {
                    if (arguments[i].hasOwnProperty(key))
                        arguments[0][key] = arguments[i][key];
                }
            }

            return arguments[0];
        },

        /**
         * Check if Object is an Array.
         */
        isArray: function(obj) {
            if (Array.isArray)
                return Array.isArray(obj);
            else
                return Object.prototype.toString.call(obj) === '[object Array]';
        },

        /**
         * Check if an item is in Array.
         */
        contains: function(sourceArray, item) {
            var i;

            for (i = 0; i < sourceArray.length; i++)
                return (sourceArray[i] === item);
        },

        /**
         * Call a function on each item of an array.
         */
        each: function(sourceArray, fnCallback) {
            var i;

            for (i = 0; i < sourceArray.length; i++)
                fnCallback(i, sourceArray[i], sourceArray);
        },

        /**
         * Get index of an item in Array.
         */
        indexOf: function(sourceArray, item) {
            var index = -1,
                i;

            if (Array.indexOf)
                return sourceArray.indexOf(item);
            else
            {
                for (i = 0; i < sourceArray.length; i++)
                {
                    if (sourceArray[i] === item)
                    {
                        index = i;
                        break;
                    }
                }
            }

            return index;
        },

        /**
         * Add CSS Class to the given element.
         */
        addClass: function(el, cssClass) {
            var classList;

            if (el.className)
            {
                classList = el.className.split(' ');
                classList.push(cssClass);
                el.className = classList.join(' ');
            }
        },

        /**
         * Removes CSS Class from given element.
         */
        removeClass: function(el, cssClass) {
            var classList,
                indexOfClass;

            if (el.className)
            {
                classList = el.className.split(' ');
                if (this.contains(classList, cssClass))
                {
                    indexOfClass = this.indexOf(classList, cssClass);

                    if (indexOfClass > -1)
                        classList.splice(indexOfClass, 1);

                    el.className = classList.join(' ');
                }
            }
        },

        /**
         * Toggles CSS Class on provided element, with optional Boolean state.
         */
        toggleClass: function(el, cssClass, state) {
            var classList,
                fnAddClass;

            if (el.className)
            {
                if (state)
                {
                    this.addClass(el, cssClass);
                }
                else
                {
                    classList = el.className.split(' ');
                    if (!this.contains(classList, cssClass))
                        this.addClass(el, cssClass);
                    else
                        this.removeClass(el, cssClass);
                }
            }
        }
    };

    var IE = !!(/msie/i.exec(window.navigator.userAgent)),
        PALETTE = ["#ffffff", "#000000", "#ff0000", "#ff8000", "#ffff00", "#008000", "#0000ff", "#4b0082", "#9400d3"],
        emptyFn = function() {};

    var locale = {
        cancelText: "cancel",
        chooseText: "choose",
        togglePaletteMoreText: "more",
        togglePaletteLessText: "less",
        clearText: "Clear Color Selection",
        noColorSelectedText: "No Color Selected"
    };

    var defaultOptions = {
        // Callbacks
        beforeShow: emptyFn,
        move: emptyFn,
        change: emptyFn,
        show: emptyFn,
        hide: emptyFn,

        // Options
        color: false,
        flat: false,
        showInput: false,
        allowEmpty: false,
        showButtons: true,
        clickoutFiresChange: true,
        showInitial: false,
        showPalette: false,
        showPaletteOnly: false,
        hideAfterPaletteSelect: false,
        togglePaletteOnly: false,
        showSelectionPalette: true,
        localStorageKey: false,
        appendTo: "body",
        maxSelectionSize: 7,
        preferredFormat: false,
        className: "", // Deprecated - use containerClassName and replacerClassName instead.
        containerClassName: "",
        replacerClassName: "",
        showAlpha: false,
        theme: "csp-light",
        palette: [PALETTE],
        selectionPalette: [],
        disabled: false,
        offset: null
    };


    // UMD Definition < https://github.com/umdjs/umd >.
    if (typeof exports !== 'undefined')
    {
        if (typeof module !== 'undefined' &&
            module.exports)
        {
            exports = module.exports = colorspectre;
        }
        exports.colorspectre = colorspectre;
    }
    else
    {
        self.colorspectre = colorspectre;
    }
}).call(this);
