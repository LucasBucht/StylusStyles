// ==UserScript==
// @name         BetterCampus iframe declutter
// @namespace    github.com/openstyles/stylus
// @version      1.0.0
// @description  Hides upgrade/trial buttons inside the ext.bettercampus.com iframe (runs inside that frame directly, since it's cross-origin from canvas.pitt.edu)
// @match        https://ext.bettercampus.com/*
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const CSS = `
        button[title="Start your free trial"] {
            display: none !important;
        }
        .bc-btn:has(.text-premium),
        .bc-btn:has(.fill-premium) {
            display: none !important;
        }
    `;

    function inject() {
        if (document.querySelector('style[data-bc-declutter-iframe]')) return;
        const style = document.createElement('style');
        style.setAttribute('data-bc-declutter-iframe', 'true');
        style.textContent = CSS;
        document.head.appendChild(style);
    }

    inject();

    // This iframe's content is a full React app (same tech stack as the
    // shadow DOM widgets), so it can re-render after initial load.
    const observer = new MutationObserver(inject);
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
