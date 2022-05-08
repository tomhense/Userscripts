// ==UserScript==
// @name         Imgur redirect to image
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Codedotexe
// @match        https://imgur.com/*
// @icon         https://www.google.com/s2/favicons?domain=imgur.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/Codedotexe/Userscripts/main/ImgurRedirectToImage.js
// @updateURL    https://raw.githubusercontent.com/Codedotexe/Userscripts/main/ImgurRedirectToImage.js
// ==/UserScript==

function allowNsfw() {
    let nsfwYesButton = document.querySelector("div.Wall-Button.Button.btn-wall--yes");
    if(nsfwYesButton != null) {
        nsfwYesButton.click();
        redirectToImage();
    }
}

function redirectToImage() {
    const imageContainers = document.querySelectorAll("div.Gallery-Content--mediaContainer");
    if(imageContainers.length == 1) { // Do not do this for galleries
        const image = imageContainers[0].querySelector("img.image-placeholder");
        if(image != null) {
            window.location = image.src;
        }
    }
}

(function() {
    'use strict';
    setTimeout(allowNsfw, 500);
    setTimeout(redirectToImage, 500);
})();
