// ==UserScript==
// @name         Nebular resize Videos
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://nebula.app/videos/*
// @icon         https://www.google.com/s2/favicons?domain=nebula.app
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/Codedotexe/Userscripts/main/NebularResizeVideos
// @updateURL    https://raw.githubusercontent.com/Codedotexe/Userscripts/main/NebularResizeVideos
// ==/UserScript==

(function() {
    'use strict';
    
    function resize() {
        const iframeWrapper = document.querySelector(".VideoPlayer-iFrame").parentElement;
        const width = Math.min(window.innerWidth, window.innerHeight * (16/9));
        iframeWrapper.style.width = width + "px";
        iframeWrapper.style.height = Math.floor(width * (9/16)) + "px";
    }

    window.onresize = resize;
    setTimeout(resize, 1500);
})();
