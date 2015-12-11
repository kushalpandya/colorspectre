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
