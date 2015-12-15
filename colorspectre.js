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

    /**
     * Namespace declarations.
     */
    var self = this,
        hasRequire = (typeof require !== 'undefined'),
        old_colorspectre = self.colorspectre,
        colorspectre;

    /**
     * Global Constant declarations.
     */
    var IE = !!(/msie/i.exec(window.navigator.userAgent)),
        PALETTE = ["#ffffff", "#000000", "#ff0000", "#ff8000", "#ffff00", "#008000", "#0000ff", "#4b0082", "#9400d3"],
        MATH = Math,
        MIN = MATH.min,
        MAX = MATH.max,
        ROUND = MATH.round,
        RAND = MATH.random,
        TRIMLEFT = /^[\s,#]+/,
        TRIMRIGHT = /\s+$/,
        NAMES,
        emptyFn = function() {},
        CSException,
        matchers;

    /**
     * Internal API declarations.
     */
    var _,
        Color,
        Tinycolor;

    /**
     * Extra variables.
     */
    var locale,
        defaultOptions,
        fnRgbaSupport,
        replaceInput,
        markup;

    /**
     * Named Colors and Hex codes.
     * http://www.w3.org/TR/css3-color/#svg-color
     */
    NAMES = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "0ff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000",
        blanchedalmond: "ffebcd",
        blue: "00f",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        burntsienna: "ea7e5d",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "0ff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkgrey: "a9a9a9",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkslategrey: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "f0f",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        grey: "808080",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgray: "d3d3d3",
        lightgreen: "90ee90",
        lightgrey: "d3d3d3",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "789",
        lightslategrey: "789",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "0f0",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "f0f",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370db",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "db7093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        rebeccapurple: "663399",
        red: "f00",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        slategrey: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "fff",
        whitesmoke: "f5f5f5",
        yellow: "ff0",
        yellowgreen: "9acd32"
    };

    /**
     * Global class to throw Colorspectre specific Exceptions.
     */
    CSException = function(type, message) {
        this.name = type;
        this.code = DOMException[type];
        this.message = message;
    };

    /**
     * Regex matcher for color values provided as RGB, RGBA, HSL, HSLA, HSV, HSVA and Hex.
     */
    matchers = (function() {
        var CSS_INTEGER,
            CSS_NUMBER,
            CSS_UNIT,
            PERMISSIVE_MATCH3,
            PERMISSIVE_MATCH4;

        // <http://www.w3.org/TR/css3-values/#integers>
        CSS_INTEGER = "[-\\+]?\\d+%?";

        // <http://www.w3.org/TR/css3-values/#number-value>
        CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

        // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
        CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

        // Actual matching.
        // Parentheses and commas are optional, but not required.
        // Whitespace can take the place of commas or opening paren
        PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
        PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

        return {
            rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
            rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
            hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
            hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
            hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
            hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
            hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
        };
    })();

    /**
     * Basic Underscore Utility Functions, this is where jQuery replacements go.
     */
    _ = {
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
         * Returns a flipped map object, where key becomes value and value becomes key.
         */
        flipMap: function(mapObj) {
            var flipped = {},
                key;

            for (key in mapObj)
            {
                if (mapObj.hasOwnProperty(key))
                    flipped[mapObj[key]] = key;
            }

            return flipped;
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
         * Get index of an item in Array.
         */
        indexOf: function(sourceArray, item) {
            var index = -1,
                i;

            if (Array.prototype.indexOf)
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
         * Check if an item is in Array.
         */
        contains: function(sourceArray, item) {
            return this.indexOf(sourceArray, item) > -1;
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
         * Checks if CSS class is present in given element.
         */
        hasClass: function(el, cssClass) {
            var classList;

            if (el.className)
            {
                classList = el.className.split(' ');
                return this.contains(classList, cssClass);
            }
            else
                throw new CSException("NOT_SUPPORTED_ERR", "className is not supported for this element.");
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
            else
                throw new CSException("NOT_SUPPORTED_ERR", "className is not supported for this element.");
        },

        /**
         * Removes CSS Class from given element.
         */
        removeClass: function(el, cssClass) {
            var classList,
                i;

            if (el.className)
            {
                classList = el.className.split(' ');

                for (i = classList.length - 1; i > 0; i--)
                {
                    if (classList[i] === cssClass)
                        classList.splice(i, 1);
                }

                el.className = classList.join(' ');
            }
            else
                throw new CSException("NOT_SUPPORTED_ERR", "className is not supported for this element.");
        },

        /**
         * Toggles CSS Class on provided element, with optional Boolean state.
         */
        toggleClass: function(el, cssClass, state) {
            if (el.className)
            {
                if (typeof state === 'boolean')
                {
                    if (state)
                        this.addClass(el, cssClass);
                    else
                        this.removeClass(el, cssClass);
                }
                else
                {
                    if (this.hasClass(el, cssClass))
                        this.removeClass(el, cssClass);
                    else
                        this.addClass(el, cssClass);
                }
            }
            else
                throw new CSException("NOT_SUPPORTED_ERR", "className is not supported for this element.");
        },

        /**
         * Return a valid alpha value [0,1] with all invalid values being set to 1.
         */
        boundAlpha: function(a) {
            a = parseFloat(a);

            if (isNaN(a) ||
                a < 0 ||
                a > 1)
                a = 1;

            return a;
        },

        /**
         * Parse a base-16 hex value into a base-10 integer
         */
        parseIntFromHex: function(val) {
            return parseInt(val, 16);
        },

        /**
         * Converts a decimal to a hex value.
         */
        convertDecimalToHex: function(dec) {
            return ROUND(parseFloat(dec) * 255).toString(16);
        },

        /**
         * Converts a hex value to a decimal.
         */
        convertHexToDecimal: function(hex) {
            return (this.parseIntFromHex(hex) / 255);
        },

        /**
         * Converts a decimal to it's percentage value.
         */
        convertToPercentage: function(n) {
            if (n <= 1)
                n = (n * 100) + "%";

            return n;
        },

        /**
         * Force a hex value to have 2 characters
         */
        pad2: function(hex) {
            return hex.length == 1 ? '0' + hex : '' + hex;
        },

        /**
         * Force a number between 0 and 1.
         */
        clamp01: function(val) {
            return MIN(1, MAX(0, val));
        },

        /**
         * Take input from [0, n] and return it as [0, 1]
         */
        bound01: function(n, max) {
            var processPercent;

            if (this.isOnePointZero(n))
                n = "100%";

            processPercent = this.isPercentage(n);
            n = MIN(max, MAX(0, parseFloat(n)));

            // Automatically convert percentage into number
            if (processPercent)
                n = parseInt(n * max, 10) / 100;

            // Handle floating point rounding errors
            if ((MATH.abs(n - max) < 0.000001))
                return 1;

            // Convert into [0, 1] range if it isn't already
            return (n % max) / parseFloat(max);
        },

        /**
         * Check if value is a percentage.
         */
        isPercentage: function(n) {
            return typeof n === "string" && n.indexOf('%') != -1;
        },

        /**
         * Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
         * <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
         */
        isOnePointZero: function(n) {
            return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
        },

        /**
         * Permissive string parsing. Take in a number of formats, and output an object.
         * based on detected format. Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
         */
        stringInputToObject: function(color) {
            var named = false,
                match;

            color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();

            if (NAMES[color])
            {
                color = NAMES[color];
                named = true;
            }
            else if (color === 'transparent')
                return { r: 0, g: 0, b: 0, a: 0, format: "name" };

            if ((match = matchers.rgb.exec(color)))
                return { r: match[1], g: match[2], b: match[3] };
            if ((match = matchers.rgba.exec(color)))
                return { r: match[1], g: match[2], b: match[3], a: match[4] };
            if ((match = matchers.hsl.exec(color)))
                return { h: match[1], s: match[2], l: match[3] };
            if ((match = matchers.hsla.exec(color)))
                return { h: match[1], s: match[2], l: match[3], a: match[4] };
            if ((match = matchers.hsv.exec(color)))
                return { h: match[1], s: match[2], v: match[3] };
            if ((match = matchers.hsva.exec(color)))
                return { h: match[1], s: match[2], v: match[3], a: match[4] };
            if ((match = matchers.hex8.exec(color)))
            {
                return {
                    a: this.convertHexToDecimal(match[1]),
                    r: this.parseIntFromHex(match[2]),
                    g: this.parseIntFromHex(match[3]),
                    b: this.parseIntFromHex(match[4]),
                    format: named ? "name" : "hex8"
                };
            }
            if ((match = matchers.hex6.exec(color)))
            {
                return {
                    r: this.parseIntFromHex(match[1]),
                    g: this.parseIntFromHex(match[2]),
                    b: this.parseIntFromHex(match[3]),
                    format: named ? "name" : "hex"
                };
            }
            if ((match = matchers.hex3.exec(color)))
            {
                return {
                    r: this.parseIntFromHex(match[1] + '' + match[1]),
                    g: this.parseIntFromHex(match[2] + '' + match[2]),
                    b: this.parseIntFromHex(match[3] + '' + match[3]),
                    format: named ? "name" : "hex"
                };
            }

            return false;
        }
    };

    locale = {
        cancelText: "cancel",
        chooseText: "choose",
        togglePaletteMoreText: "more",
        togglePaletteLessText: "less",
        clearText: "Clear Color Selection",
        noColorSelectedText: "No Color Selected"
    };

    defaultOptions = {
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

    fnRgbaSupport = function() {
        var el = document.createElement('div'),
            style = el.style,
            fnContains;

        fnContains = function(str, substr) {
            return !!~('' + str).indexOf(substr);
        };

        style.cssText = 'background-color:rgba(0,0,0,.5)';

        return fnContains(style.backgroundColor, 'rgba') || fnContains(style.backgroundColor, 'hsla');
    };

    replaceInput = [
        '<div class="cs-replacer">',
            '<div class="cs-preview"><div class="cs-preview-inner"></div></div>',
            '<div class="cs-dd">&#9660;</div>',
        '</div>'
    ].join('');

    markup = (function() {
        var gradientEls = "",
            mainEl,
            i;

        // IE does not support gradients with multiple stops, so we need to simulate
        // that for the rainbow slider with 8 divs that each have a single gradient
        if (IE)
        {
            for (i = 1; i <= 6; i++)
                gradientEls = '<div class="ie-cs-stop-'+ i +'"></div>';
        }

        mainEl = [
            '<div class="cs-container cs-hidden">',
                '<div class="cs-palette-container">',
                    '<div class="cs-palette cs-thumb cs-cf"></div>',
                    '<div class="cs-palette-button-container cs-cf">',
                        '<button type="button" class="cs-palette-toggle"></button>',
                    '</div>',
                '</div>',
                '<div class="cs-picker-container">',
                    '<div class="cs-top cs-cf">',
                        '<div class="cs-fill"></div>',
                        '<div class="cs-top-inner">',
                            '<div class="cs-color">',
                                '<div class="cs-sat">',
                                    '<div class="cs-val">',
                                        '<div class="cs-dragger"></div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                            '<div class="cs-clear cs-clear-display">',
                            '</div>',
                            '<div class="cs-hue">',
                                '<div class="cs-slider"></div>',
                                gradientEls,
                            '</div>',
                        '</div>',
                        '<div class="cs-alpha"><div class="cs-alpha-inner"><div class="cs-alpha-handle"></div></div></div>',
                    '</div>',
                    '<div class="cs-input-container cs-cf">',
                        '<input class="cs-input" type="text" spellcheck="false"  />',
                    '</div>',
                    '<div class="cs-initial cs-thumb cs-cf"></div>',
                    '<div class="cs-button-container cs-cf">',
                        '<a class="cs-cancel" href="a">',
                        '<button type="button" class="cs-choose"></button>',
                    '</div>',
                '</div>',
            '</div>'
        ];

        return mainEl.join('');
    })();

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
