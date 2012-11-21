/*! Ago - v0.1.1 - 2012-11-20
* https://github.com/Problematic/Ago
* Copyright (c) 2012 Derek Stobbe; Licensed MIT */

(function () {
    "use strict";

    var Ago = function Ago(options) {
        if (!(this instanceof Ago)) { return new Ago(options); }

        this.options = Ago.merge({
            intervalText: ["years", "months", "weeks", "days", "hours", "minutes", "seconds"],
            justNowBuffer: 5000,
            justNowText: "just now",
            resolution: 2,
            returnText: "%s ago"
        }, options);
    };

    if (typeof exports !== "undefined") {
        if (typeof module !== "undefined" && module.exports) {
            exports = module.exports = Ago;
        }
        exports.Ago = Ago;
    } else {
        window.Ago = Ago;
    }

    Ago.prototype.humanize = function humanize(date) {
        var i, elapsed, remaining, current, elapsedIntervals = [],
            intervals = this.options.intervalText,
            resolution = this.options.resolution;

        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        elapsed = remaining = Date.now() - date.getTime();

        if (elapsed <= this.options.justNowBuffer) {
            return this.options.justNowText;
        }

        for (i = 0; i < intervals.length; i++) {
            current = Math.floor(remaining / Ago.interval[intervals[i]]);

            if (current > 0) {
                elapsedIntervals.push(current + ' ' + (current === 1 ? intervals[i].slice(0, -1) : intervals[i]));

                if (this.options.resolution !== null) {
                    resolution--;
                    if (resolution <= 0) {
                        break;
                    }
                }
            }

            remaining = remaining % Ago.interval[intervals[i]];
        }

        return this.options.returnText.replace("%s", elapsedIntervals.join(", "));
    };

    if (typeof Date.prototype.ago === "undefined") {
        Date.prototype.ago = function (options) {
            var ago = new Ago(options);

            return ago.humanize(this);
        };

        Object.defineProperty(Date.prototype, 'ago', {
            configurable: true,
            enumerable: false
        });
    }

    /* Utility stuff */
    Ago.interval = {
        seconds: 1000,
        minutes: 1000 * 60,
        hours:   1000 * 60 * 60,
        days:    1000 * 60 * 60 * 24,
        weeks:   1000 * 60 * 60 * 24 * 7,
        months:  1000 * 60 * 60 * 24 * 30,
        years:   1000 * 60 * 60 * 24 * 7 * 52
    };

    Ago.merge = function merge(obj1, obj2) {
        var obj = {}, x;

        for (x in obj1) {
            if (obj1.hasOwnProperty(x)) {
                obj[x] = obj1[x];
            }
        }
        for (x in obj2) {
            if (obj2.hasOwnProperty(x)) {
                obj[x] = obj2[x];
            }
        }

        return obj;
    };
}());
