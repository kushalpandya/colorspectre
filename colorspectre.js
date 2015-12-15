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
        HEXNAMES,
        emptyFn = function() {},
        CSException,
        matchers;

    /**
     * Internal API declarations.
     */
    var _,
        Color,
        Tinycolor,
        TinycolorUtil,
        tinyCounter = 0;

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

            color = color.replace(TRIMLEFT,'').replace(TRIMRIGHT, '').toLowerCase();

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

    /**
     * Color manipulation utility Functions.
     * Uses <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
     */
    Color = {
        /**
         * Handle bounds / percentage checking to conform to CSS color spec
         * <http://www.w3.org/TR/css3-color/>
         * *Assumes:* r, g, b in [0, 255] or [0, 1]
         * *Returns:* { r, g, b } in [0, 255]
         */
        rgbToRgb: function(r, g, b) {
            return {
                r: _.bound01(r, 255) * 255,
                g: _.bound01(g, 255) * 255,
                b: _.bound01(b, 255) * 255
            };
        },

        /**
         * Converts an RGB color value to HSL.
         * *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
         * *Returns:* { h, s, l } in [0,1]
         */
        rgbToHsl: function(r, g, b) {
            var h, s, l,
                min, max, diff;

            r = _.bound01(r, 255);
            g = _.bound01(g, 255);
            b = _.bound01(b, 255);

            max = MAX(r, g, b);
            min = MIN(r, g, b);

            l = (max + min) / 2;

            if (max === min)
                h = s = 0; // achromatic.
            else
            {
                diff = max - min;
                s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

                switch(max)
                {
                    case r:
                        h = (g - b) / diff + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / diff + 2;
                        break;
                    case b:
                        h = (r - g) / diff + 4;
                        break;
                }

                h /= 6;
            }

            return { h: h, s: s, l: l };
        },

        /**
         * Converts an HSL color value to RGB.
         * *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
         * *Returns:* { r, g, b } in the set [0, 255]
         */
        hslToRgb: function(h, s, l) {
            var r, g, b, p, q,
                hue2rgb;

            h = _.bound01(h, 360);
            s = _.bound01(s, 100);
            l = _.bound01(l, 100);

            hue2rgb = function(p, q, t) {
                if (t < 0)
                    t += 1;

                if (t > 1)
                    t -= 1;

                if (t < 1/6)
                    return p + (q - p) * 6 * t;
                if (t < 1/2)
                    return q;
                if (t < 2/3)
                    return p + (q - p) * (2/3 - t) * 6;

                return p;
            };

            if (s === 0)
                r = g = b = l; // achromatic
            else
            {
                q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return { r: r * 255, g: g * 255, b: b * 255 };
        },

        /**
         * Converts an RGB color value to HSV.
         * *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
         * *Returns:* { h, s, v } in [0,1]
         */
        rgbToHsv: function(r, g, b) {
            var h, s, v,
                max, min, diff;

            r = _.bound01(r, 255);
            g = _.bound01(g, 255);
            b = _.bound01(b, 255);

            max = MAX(r, g, b);
            min = MIN(r, g, b);

            v = max;
            diff = max - min;
            s = max === 0 ? 0 : diff / max;

            if (max === min)
                h = 0; // achromatic
            else
            {
                switch(max)
                {
                    case r:
                        h = (g - b) / diff + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / diff + 2;
                        break;
                    case b:
                        h = (r - g) / diff + 4;
                        break;
                }

                h /= 6;
            }

            return { h: h, s: s, v: v };
        },

        /**
         * Converts an HSV color value to RGB.
         * *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
         * *Returns:* { r, g, b } in the set [0, 255]
         */
        hsvToRgb: function(h, s, v) {
            var r, g, b,
                p, q, t,
                i, f,
                mod;

            h = _.bound01(h, 360) * 6;
            s = _.bound01(s, 100);
            v = _.bound01(v, 100);

            i = MATH.floor(h);
            f = h - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            mod = i % 6;
            r = [v, q, p, p, t, v][mod];
            g = [t, v, v, q, p, p][mod];
            b = [p, p, t, v, v, q][mod];

            return { r: r * 255, g: g * 255, b: b * 255 };
        },

        /**
         * Converts an RGB color to Hex.
         * *Assumes:* r, g, and b are contained in the set [0, 255]
         * *Returns:* a 3 or 6 character hex.
         */
        rgbToHex: function(r, g, b, allow3Char) {
            var hex;

            hex = [
                _.pad2(ROUND(r).toString(16)),
                _.pad2(ROUND(g).toString(16)),
                _.pad2(ROUND(b).toString(16))
            ];

            if (allow3Char &&
                hex[0].charAt(0) === hex[0].charAt(1) &&
                hex[1].charAt(0) === hex[1].charAt(1) &&
                hex[2].charAt(0) === hex[2].charAt(1))
            {
                return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
            }

            return hex.join("");
        },

        /**
         * Converts an RGBA color plus alpha transparency to hex.
         * *Assumes:* r, g, b and a are contained in the set [0, 255]
         * *Returns:* an 8 character hex.
         */
        rgbaToHex: function(r, g, b, a) {
            var hex = [
                _.pad2(_.convertDecimalToHex(a)),
                _.pad2(ROUND(r).toString(16)),
                _.pad2(ROUND(g).toString(16)),
                _.pad2(ROUND(b).toString(16))
            ];

            return hex.join("");
        },

        /**
         * Given a string or object, convert that input to RGB
         * Possible string inputs:
         *
         *     "red"
         *     "#f00" or "f00"
         *     "#ff0000" or "ff0000"
         *     "#ff000000" or "ff000000"
         *     "rgb 255 0 0" or "rgb (255, 0, 0)"
         *     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
         *     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
         *     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
         *     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
         *     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
         *     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
         */
        inputToRGB: function(color) {
            var rgb = { r: 0, g: 0, b: 0 },
                a = 1,
                ok = false,
                format = false;

            if (typeof color == "string")
                color = _.stringInputToObject(color);

            if (typeof color == "object")
            {
                if (color.hasOwnProperty("r") &&
                    color.hasOwnProperty("g") &&
                    color.hasOwnProperty("b"))
                {
                    rgb = this.rgbToRgb(color.r, color.g, color.b);
                    ok = true;
                    format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
                }
                else if (color.hasOwnProperty("h") &&
                         color.hasOwnProperty("s") &&
                         color.hasOwnProperty("v"))
                {
                    color.s = _.convertToPercentage(color.s);
                    color.v = _.convertToPercentage(color.v);
                    rgb = this.hsvToRgb(color.h, color.s, color.v);
                    ok = true;
                    format = "hsv";
                }
                else if (color.hasOwnProperty("h") &&
                         color.hasOwnProperty("s") &&
                         color.hasOwnProperty("l"))
                {
                    color.s = _.convertToPercentage(color.s);
                    color.l = _.convertToPercentage(color.l);
                    rgb = this.hslToRgb(color.h, color.s, color.l);
                    ok = true;
                    format = "hsl";
                }

                if (color.hasOwnProperty("a"))
                    a = color.a;
            }

            a = _.boundAlpha(a);

            return {
                ok: ok,
                format: color.format || format,
                r: MIN(255, MAX(rgb.r, 0)),
                g: MIN(255, MAX(rgb.g, 0)),
                b: MIN(255, MAX(rgb.b, 0)),
                a: a
            };
        }
    };

    /**
     * Swapped Color names to Hex code map.
     */
    HEXNAMES = _.flipMap(NAMES);

    /**
     * Tinycolor v1.1.2.
     * https://github.com/bgrins/TinyColor
     */
    Tinycolor = function(color, opts) {
        var rgb;

        color = color || '';
        opts = opts || {};

        // If input is already a Tinycolor, return itself
        if (color instanceof Tinycolor)
            return color;

        // If we are called as a function, call using new instead
        if (!(this instanceof Tinycolor))
            return new Tinycolor(color, opts);

        rgb = Color.inputToRGB(color);
        this._originalInput = color;
        this._r = rgb.r;
        this._g = rgb.g;
        this._b = rgb.b;
        this._a = rgb.a;
        this._roundA = ROUND(100*this._a) / 100;
        this._format = opts.format || rgb.format;
        this._gradientType = opts.gradientType;

        // Don't let the range of [0,255] come back in [0,1].
        // Potentially lose a little bit of precision here, but will fix issues where
        // .5 gets interpreted as half of the total, instead of half of 1
        // If it was supposed to be 128, this was already taken care of by `inputToRgb`
        if (this._r < 1)
            this._r = ROUND(this._r);
        if (this._g < 1)
            this._g = ROUND(this._g);
        if (this._b < 1)
            this._b = ROUND(this._b);

        this._ok = rgb.ok;
        this._tc_id = tinyCounter++;
    };

    Tinycolor.prototype = {
        isDark: function() {
            return this.getBrightness() < 128;
        },

        isLight: function() {
            return !this.isDark();
        },

        isValid: function() {
            return this._ok;
        },

        getOriginalInput: function() {
            return this._originalInput;
        },

        getFormat: function() {
            return this._format;
        },

        getAlpha: function() {
            return this._a;
        },

        getBrightness: function() {
            var rgb = this.toRgb();

            return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        },

        setAlpha: function(value) {
            this._a = _.boundAlpha(value);
            this._roundA = ROUND(100*this._a) / 100;

            return this;
        },

        toHsv: function() {
            var hsv = Color.rgbToHsv(this._r, this._g, this._b);

            return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
        },

        toHsvString: function() {
            var hsv = Color.rgbToHsv(this._r, this._g, this._b),
                h = ROUND(hsv.h * 360),
                s = ROUND(hsv.s * 100),
                v = ROUND(hsv.v * 100);

            return (this._a == 1) ?
                        "hsv("  + h + ", " + s + "%, " + v + "%)" :
                        "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
        },

        toHsl: function() {
            var hsl = Color.rgbToHsl(this._r, this._g, this._b);

            return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
        },

        toHslString: function() {
            var hsl = Color.rgbToHsl(this._r, this._g, this._b),
                h = ROUND(hsl.h * 360),
                s = ROUND(hsl.s * 100),
                l = ROUND(hsl.l * 100);

            return (this._a == 1) ?
                        "hsl("  + h + ", " + s + "%, " + l + "%)" :
                        "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
        },

        toHex: function(allow3Char) {
            return Color.rgbToHex(this._r, this._g, this._b, allow3Char);
        },

        toHexString: function(allow3Char) {
            return '#' + this.toHex(allow3Char);
        },

        toHex8: function() {
            return Color.rgbaToHex(this._r, this._g, this._b, this._a);
        },

        toHex8String: function() {
            return '#' + this.toHex8();
        },

        toRgb: function() {
            return { r: ROUND(this._r), g: ROUND(this._g), b: ROUND(this._b), a: this._a };
        },

        toRgbString: function() {
            return (this._a == 1) ?
                        "rgb("  + ROUND(this._r) + ", " + ROUND(this._g) + ", " + ROUND(this._b) + ")" :
                        "rgba(" + ROUND(this._r) + ", " + ROUND(this._g) + ", " + ROUND(this._b) + ", " + this._roundA + ")";
        },

        toPercentageRgb: function() {
            return {
                r: ROUND(_.bound01(this._r, 255) * 100) + "%",
                g: ROUND(_.bound01(this._g, 255) * 100) + "%",
                b: ROUND(_.bound01(this._b, 255) * 100) + "%",
                a: this._a
            };
        },

        toPercentageRgbString: function() {
            return (this._a == 1) ?
                        "rgb("  + ROUND(_.bound01(this._r, 255) * 100) + "%, " + ROUND(_.bound01(this._g, 255) * 100) + "%, " + ROUND(_.bound01(this._b, 255) * 100) + "%)" :
                        "rgba(" + ROUND(_.bound01(this._r, 255) * 100) + "%, " + ROUND(_.bound01(this._g, 255) * 100) + "%, " + ROUND(_.bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
        },

        toName: function() {
            if (this._a === 0)
                return "transparent";

            if (this._a < 1)
                return false;

            return HEXNAMES[Color.rgbToHex(this._r, this._g, this._b, true)] || false;
        },

        toFilter: function(secondColor) {
            var hex8String = '#' + Color.rgbaToHex(this._r, this._g, this._b, this._a),
                secondHex8String = hex8String,
                gradientType = this._gradientType ? "GradientType = 1, " : "",
                s;

            if (secondColor)
            {
                s = Tinycolor(secondColor);
                secondHex8String = s.toHex8String();
            }

            return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
        },

        toString: function(format) {
            var formattedString = false,
                hasAlpha = this._a < 1 && this._a >= 0,
                formatSet,
                needsAlphaFormat;


            formatSet = !!format;
            format = format || this._format;
            needsAlphaFormat = !formatSet &&
                                hasAlpha &&
                                (
                                    format === "hex" ||
                                    format === "hex6" ||
                                    format === "hex3" ||
                                    format === "name"
                                );

            if (needsAlphaFormat)
            {
                // Special case for "transparent", all other non-alpha formats
                // will return rgba when there is transparency.
                if (format === "name" &&
                    this._a === 0)
                    return this.toName();

                return this.toRgbString();
            }

            switch(format)
            {
                case 'rgb':
                    formattedString = this.toRgbString();
                    break;
                case 'prgb':
                    formattedString = this.toPercentageRgbString();
                    break;
                case 'hex':
                case 'hex6':
                    formattedString = this.toHexString();
                    break;
                case 'hex3':
                    formattedString = this.toHexString(true);
                    break;
                case 'hex8':
                    formattedString = this.toHex8String();
                    break;
                case 'name':
                    formattedString = this.toName();
                    break;
                case 'hsl':
                    formattedString = this.toHslString();
                    break;
                case 'hsv':
                    formattedString = this.toHsvString();
                    break;
            }

            return formattedString || this.toHexString();
        },

        _applyModification: function(fn, args) {
            var color = fn.apply(null, [this].concat([].slice.call(args)));
            this._r = color._r;
            this._g = color._g;
            this._b = color._b;
            this.setAlpha(color._a);
            return this;
        },

        lighten: function() {
            return this._applyModification(lighten, arguments);
        },

        brighten: function() {
            return this._applyModification(brighten, arguments);
        },

        darken: function() {
            return this._applyModification(darken, arguments);
        },

        desaturate: function() {
            return this._applyModification(desaturate, arguments);
        },

        saturate: function() {
            return this._applyModification(saturate, arguments);
        },

        greyscale: function() {
            return this._applyModification(greyscale, arguments);
        },

        spin: function() {
            return this._applyModification(spin, arguments);
        },

        _applyCombination: function(fn, args) {
            return fn.apply(null, [this].concat([].slice.call(args)));
        },

        analogous: function() {
            return this._applyCombination(analogous, arguments);
        },

        complement: function() {
            return this._applyCombination(complement, arguments);
        },

        monochromatic: function() {
            return this._applyCombination(monochromatic, arguments);
        },

        splitcomplement: function() {
            return this._applyCombination(splitcomplement, arguments);
        },

        triad: function() {
            return this._applyCombination(triad, arguments);
        },

        tetrad: function() {
            return this._applyCombination(tetrad, arguments);
        }
    };

    Tinycolor.fromRatio = function(color, opts) {
        var newColor = {},
            i;

        if (typeof color === "object")
        {
            for (i in color)
            {
                if (color.hasOwnProperty(i))
                {
                    if (i === "a")
                        newColor[i] = color[i];
                    else
                        newColor[i] = _.convertToPercentage(color[i]);
                }
            }

            color = newColor;
        }

        return Tinycolor(color, opts);
    };

    Tinycolor.equals = function (color1, color2) {
        if (!color1 || !color2)
            return false;

        return Tinycolor(color1).toRgbString() == Tinycolor(color2).toRgbString();
    };

    Tinycolor.random = function() {
        return Tinycolor.fromRatio({
            r: RAND(),
            g: RAND(),
            b: RAND()
        });
    };

    Tinycolor.mix = function(color1, color2, amount) {
        var rgba,
            rgb1, rgb2,
            p, w, a,
            w1, w2;

        amount = (amount === 0) ? 0 : (amount || 50);
        rgb1 = Tinycolor(color1).toRgb();
        rgb2 = Tinycolor(color2).toRgb();
        p = amount / 100;
        w = p * 2 - 1;
        a = rgb2.a - rgb1.a;

        if (w * a === -1)
            w1 = w;
        else
            w1 = (w + a) / (1 + w * a);

        w1 = (w1 + 1) / 2;
        w2 = 1 - w1;

        rgba = {
            r: rgb2.r * w1 + rgb1.r * w2,
            g: rgb2.g * w1 + rgb1.g * w2,
            b: rgb2.b * w1 + rgb1.b * w2,
            a: rgb2.a * p  + rgb1.a * (1 - p)
        };

        return Tinycolor(rgba);
    };

    /**
     * Analyze the 2 colors and returns an object with the following properties:
     * `brightness`: difference in brightness between the two colors
     * `color`: difference in color/hue between the two colors
     */
    Tinycolor.readability = function(color1, color2) {
        var c1, c2,
            rgb1, rgb2,
            brightnessA, brightnessB,
            colorDiff;

        c1 = Tinycolor(color1);
        c2 = Tinycolor(color2);
        rgb1 = c1.toRgb();
        rgb2 = c2.toRgb();
        brightnessA = c1.getBrightness();
        brightnessB = c2.getBrightness();

        colorDiff = (
            MAX(rgb1.r, rgb2.r) - MIN(rgb1.r, rgb2.r) +
            MAX(rgb1.g, rgb2.g) - MIN(rgb1.g, rgb2.g) +
            MAX(rgb1.b, rgb2.b) - MIN(rgb1.b, rgb2.b)
        );

        return {
            brightness: MATH.abs(brightnessA - brightnessB),
            color: colorDiff
        };
    };

    /**
     * Check if foreground and background color combinations provide sufficient contrast.
     * http://www.w3.org/TR/AERT#color-contrast
     * Eg; Tinycolor.isReadable("#000", "#111") => false
     */
    Tinycolor.isReadable = function(color1, color2) {
        var readability = Tinycolor.readability(color1, color2);

        return readability.brightness > 125 &&
               readability.color > 500;
    };

    /**
     * Given a base color and a list of possible foreground or background
     * colors for that base, returns the most readable color.
     * Eg; Tinycolor.mostReadable("#123", ["#fff", "#000"]) => "#000"
     */
    Tinycolor.mostReadable = function(baseColor, colorList) {
        var bestColor = null,
            bestScore = 0,
            bestIsReadable = false,
            readability,
            readable,
            score,
            i;

        for (i = 0; i < colorList.length; i++)
        {
            // We normalize both around the "acceptable" breaking point,
            // but rank brightness constrast higher than hue.
            readability = Tinycolor.readability(baseColor, colorList[i]);
            readable = readability.brightness > 125 && readability.color > 500;
            score = 3 * (readability.brightness / 125) + (readability.color / 500);

            if ((readable && !bestIsReadable) ||
                (readable && bestIsReadable && score > bestScore) ||
                ((!readable) && (!bestIsReadable) && score > bestScore))
            {
                bestIsReadable = readable;
                bestScore = score;
                bestColor = Tinycolor(colorList[i]);
            }
        }

        return bestColor;
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
