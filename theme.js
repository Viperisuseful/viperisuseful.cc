/* Global theme toggle.
   The active theme is set before first paint by a tiny inline script
   in each page's <head>. This file only handles button clicks and
   keeping tabs in sync. */
(function () {
    'use strict';

    function setTheme(t) {
        document.documentElement.setAttribute('data-theme', t);
        try { localStorage.setItem('theme', t); } catch (e) {}
    }

    function currentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function wire() {
        document.querySelectorAll('.theme-toggle').forEach(function (btn) {
            if (btn.dataset.themeWired) return;
            btn.dataset.themeWired = '1';
            btn.addEventListener('click', function () {
                setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wire);
    } else {
        wire();
    }

    // Sync the theme if it changes in another tab
    window.addEventListener('storage', function (e) {
        if (e.key === 'theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
            document.documentElement.setAttribute('data-theme', e.newValue);
        }
    });
})();
