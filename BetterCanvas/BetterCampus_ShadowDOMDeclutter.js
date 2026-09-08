// ==UserScript==
// @name         canvas.pitt.edu - BetterCampus Shadow DOM Declutter
// @namespace    github.com/openstyles/stylus
// @version      1.0.0
// @description  Injects CSS into BetterCampus shadow DOM widgets (Stylus can't reach these)
// @match        https://canvas.pitt.edu/*
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // CSS to inject inside each shadow root. Same premium-crown selector
    // logic as the main Stylus sheet, since the Sync button pattern repeats
    // inside shadow DOM too.
    const SHADOW_CSS = `
        .bc-btn:has(.text-premium),
        .bc-btn:has(.fill-premium) {
            display: none !important;
        }

        /* Top-bar "Upgrade / free 7-day trial" button */
        button[title="Start your free trial"] {
            display: none !important;
        }
    `;

    // Custom elements observed so far using declarative shadow DOM on this site.
    // Add more tag names here as you find them (inspect for <template shadowrootmode="open">
    // inside a custom element you're trying to target).
    const SHADOW_HOST_TAGS = [
        'bettercampus-todo-list',
        'bettercanvas-global-widget-manager',
        'bettercampus-navigator',
        'bettercanvas-custom-page',
        'test-element',
    ];

    function injectIntoShadow(el) {
        if (!el.shadowRoot) return;
        // Avoid double-injecting if this element already has our style tag
        if (el.shadowRoot.querySelector('style[data-bc-declutter]')) return;

        const style = document.createElement('style');
        style.setAttribute('data-bc-declutter', 'true');
        style.textContent = SHADOW_CSS;
        el.shadowRoot.appendChild(style);
    }

    function scanAndInject() {
        for (const tag of SHADOW_HOST_TAGS) {
            document.querySelectorAll(tag).forEach(injectIntoShadow);
        }
    }

    // Initial pass
    scanAndInject();

    // BetterCampus widgets can mount/remount after initial page load
    // (SPA navigation, async widget loading), so keep watching.
    const observer = new MutationObserver(() => scanAndInject());
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
