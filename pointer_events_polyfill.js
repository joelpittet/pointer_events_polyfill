/*
 * Pointer Events Polyfill: Adds support for the style attribute
 * "pointer-events: none" to browsers without this feature (namely, IE).
 *
 * (c) 2013, Kent Mewhort, licensed under BSD. See LICENSE.txt for details.
 */

/*jslint browser: true*/
/*global jQuery*/

(function ($, window, document) {
  "use strict";

  function PointerEventsPolyfill(options) {
    var defaults = {
      selector: '*',
      mouseEvents: ['click', 'dblclick', 'mousedown', 'mouseup'],
      usePolyfillIf: function () {
        var a = document.createElement('x');
        a.style.cssText = 'pointer-events:auto';
        return a.style.pointerEvents === 'auto';
      }
    };

    this.options = $.extend({}, defaults, options);

    if (this.options.usePolyfillIf()) {
      this.register_mouse_events();
    }
  }

  // Singleton initializer.
  PointerEventsPolyfill.initialize = function (options) {
    if (PointerEventsPolyfill.singleton === null) {
      PointerEventsPolyfill.singleton = new PointerEventsPolyfill(options);
    }

    return PointerEventsPolyfill.singleton;
  };

  // Handle mouse events w/ support for pointer-events: none.
  PointerEventsPolyfill.prototype.register_mouse_events = function () {
    // Register on all elements (and all future elements) matching the selector.
    $(document).on(this.options.mouseEvents.join(' '), this.options.selector, function (e) {
      var $this = $(this);
      if ($this.css('pointer-events') === 'none') {
        // peak at the element below
        var origDisplayAttribute = $this.css('display');
        $this.css('display', 'none');

        var underneathElem = document.elementFromPoint(e.clientX, e.clientY);

        if (origDisplayAttribute) {
          $this.css('display', origDisplayAttribute);
        } else {
          $this.css('display', '');
        }

        // Trigger the pointer event on the element below.
        e.target = underneathElem;
        $(underneathElem).trigger(e);

        return false;
      }

      return true;
    });
  };

  window.PointerEventsPolyfill = PointerEventsPolyfill;

}(jQuery, window, document));
