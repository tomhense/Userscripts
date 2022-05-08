// ==UserScript==
// @name         Redirect to mobile Wikipedia
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @match        https://*.wikipedia.org/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @downloadURL  https://raw.githubusercontent.com/Codedotexe/Userscripts/main/RedirectToMobileWikipedia
// @updateURL    https://raw.githubusercontent.com/Codedotexe/Userscripts/main/RedirectToMobileWikipedia
// ==/UserScript==

(function() {
    'use strict';
    const url = window.location;
    const regex = new RegExp("^[a-z]{2}\.wikipedia\.org$");
    if(url.host.match(regex)) {
        url.host = url.host.replace(".wikipedia", ".m.wikipedia");
    }
})();
