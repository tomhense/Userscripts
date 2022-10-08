// ==UserScript==
// @name         YouTube Redirect Home to Subs
// @namespace    http://tampermonkey.net/
// @include      https://www.youtube.com/*
// @author       Codedotexe
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @downloadURL  https://raw.githubusercontent.com/Codedotexe/Userscripts/main/YouTubeRedirectHomeToSubs.js
// @updateURL    https://raw.githubusercontent.com/Codedotexe/Userscripts/main/YouTubeRedirectHomeToSubs.js
// ==/UserScript==

(function() {
    'use strict';
    // Redirect to YouTube Subs

    function checkRedirect() {
        const regex = new RegExp("^https://(www)?\.youtube\.com/?$");
        const redirectInterval = setInterval(function() {
            if(regex.test(window.location)) {
                window.location = "https://www.youtube.com/feed/subscriptions";
            }
        }, 1000);
    }

    function removeLinksToHomepage() {
        // Remove YouTube logo and link to homepage
        const logoElement = document.getElementById("logo");
        if(logoElement != null) {
            logoElement.remove();
        }


        // This element in the sidebar is added dynamically, so checking in an interval to remove it
        const interval1 = setInterval(function() {
            const guideEntryHome = document.querySelector("ytd-mini-guide-entry-renderer[aria-label='Home']");
            if(guideEntryHome != null) {
                guideEntryHome.style.display = "none";
                clearInterval(interval1);
            }
        },500);
        setTimeout(function() { // If Interval is still running after this timeout, clear it
            if(interval1 != null) {
                clearInterval(interval1);
            }
        }, 5000);

        // This element in the sidebar is added dynamically, so checking in an interval to remove it
        const interval2 = setInterval(function() {
            const guideEntryLabelHome = document.querySelector("#endpoint[title='Home']");
            if(guideEntryLabelHome != null) {
                guideEntryLabelHome.style.display = "none";
                clearInterval(interval2);
            }
        },500);
        setTimeout(function() { // If Interval is still running after this timeout, clear it
            if(interval2 != null) {
                clearInterval(interval2);
            }
        }, 5000);
    }

    function redirectLogo() {
        const logoElement = document.querySelector("a#logo");
        if(logoElement != null) {
            console.log(logoElement);
            logoElement.onclick = null;
            logoElement.href = "/feed/subscriptions";
        }
        return suggestionBox != null; // return success status
    }

    function removeSuggestions() {
        if(/^https:\/\/(www)?\.youtube\.com\/watch\?v=/.test(window.location)) {
            const suggestionBox = document.getElementById("secondary");
            if(suggestionBox != null) {
                suggestionBox.style.display = "none";
            }
            return suggestionBox != null; // return success status
        }
    }

    // Check if user is logged in
    const signinButton = document.querySelector("tp-yt-paper-button[aria-label='Sign in']");
    if(signinButton == null) {
        checkRedirect();
        //redirectLogo();
        //removeLinksToHomepage();
    }

    /*document.onreadystatechange = function() { // alternative to window.onload
        if(document.readyState == "complete") {
            if(!removeSuggestions()) { // If not succeeded try agains a few seconds later
                setTimeout(removeSuggestions, 3000);
            }
        }
    };*/

})();
