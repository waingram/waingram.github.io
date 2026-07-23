/* Post-page enhancements: copy-link buttons and the contents scrollspy.
   Both are progressive: without JS the share row still links out and the
   contents list still works as plain anchors. */
(function (windowObject) {
  "use strict";

  var COPY_CONFIRMATION = "Link copied";
  var CONFIRMATION_MS = 2400;

  function initCopyButtons(document) {
    var buttons = document.querySelectorAll("[data-copy-url]");
    if (!buttons.length) return;

    var clipboard = windowObject.navigator && windowObject.navigator.clipboard;
    if (!clipboard || typeof clipboard.writeText !== "function") {
      for (var hidden = 0; hidden < buttons.length; hidden += 1) {
        buttons[hidden].hidden = true;
      }
      return;
    }

    for (var index = 0; index < buttons.length; index += 1) {
      bindCopyButton(buttons[index], clipboard);
    }
  }

  function bindCopyButton(button, clipboard) {
    var label = button.querySelector("[data-copy-label]") || button;
    var resting = label.textContent;
    var timer = null;

    label.setAttribute("aria-live", "polite");

    button.addEventListener("click", function () {
      clipboard.writeText(button.dataset.copyUrl).then(
        function () {
          label.textContent = COPY_CONFIRMATION;
          button.dataset.copied = "true";
          if (timer) windowObject.clearTimeout(timer);
          timer = windowObject.setTimeout(function () {
            label.textContent = resting;
            delete button.dataset.copied;
          }, CONFIRMATION_MS);
        },
        function () {
          /* Clipboard denied by permissions; leave the button as it was. */
        },
      );
    });
  }

  function initContentsScrollspy(document) {
    var contents = document.querySelector(".post-contents");
    if (!contents || typeof windowObject.IntersectionObserver !== "function") return;

    var links = contents.querySelectorAll("a[href^='#']");
    if (!links.length) return;

    var itemsByHeading = new Map();
    var headings = [];

    for (var index = 0; index < links.length; index += 1) {
      var id = decodeURIComponent(links[index].getAttribute("href").slice(1));
      var heading = document.getElementById(id);
      if (!heading) continue;
      itemsByHeading.set(heading, links[index].closest("li"));
      headings.push(heading);
    }
    if (!headings.length) return;

    var visible = new Set();

    var markCurrent = function (heading) {
      itemsByHeading.forEach(function (item, key) {
        if (!item) return;
        if (key === heading) item.setAttribute("aria-current", "true");
        else item.removeAttribute("aria-current");
      });
    };

    var observer = new windowObject.IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });

        var current = null;
        for (var index = 0; index < headings.length; index += 1) {
          if (visible.has(headings[index])) {
            current = headings[index];
            break;
          }
          if (headings[index].getBoundingClientRect().top < 0) current = headings[index];
        }
        markCurrent(current);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    headings.forEach(function (heading) {
      observer.observe(heading);
    });
  }

  function start() {
    var document = windowObject.document;
    if (!document) return;
    initCopyButtons(document);
    initContentsScrollspy(document);
  }

  if (windowObject.document && windowObject.document.readyState === "loading") {
    windowObject.document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})(typeof window !== "undefined" ? window : globalThis);
