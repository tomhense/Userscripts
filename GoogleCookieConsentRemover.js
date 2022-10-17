// ==UserScript==
// @name         Google Cookie Consent Remover
// @version      0.1
// @description  Remove Google's annoying cookie consent questions (especially annoying for Incognito windows)
// @author       Codedotexe
// @match        https://www.google.com/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/Codedotexe/Userscripts/main/GoogleCookieConsentRemover.js
// @updateURL    https://raw.githubusercontent.com/Codedotexe/Userscripts/main/GoogleCookieConsentRemover.js
// ==/UserScript==

document.querySelector('div[aria-modal]').remove();
document.body.style.overflow = "initial";
