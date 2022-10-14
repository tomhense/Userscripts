// ==UserScript==
// @name         Internet Archive borrowed books download helper
// @descriptino  Adds an button on Archive.org borrowed books pages to download .acsm files
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Codedotexe
// @match        https://archive.org/details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archive.org
// @grant        GM_download
// @grant        GM_addElement
// @downloadURL  https://raw.githubusercontent.com/Codedotexe/Userscripts/main/InternetArchiveBorrowedBooksDownloadHelper.js
// @updateURL    https://raw.githubusercontent.com/Codedotexe/Userscripts/main/InternetArchiveBorrowedBooksDownloadHelper.js
// ==/UserScript==

/*
INFO:
If the download does not start after pressing the button, you need to add .acsm and .xml to the extension
whitelist in the tampermonkey settings.

What can I do with the .acsm file?:
Use https://github.com/BentonEdmondson/knock to download a pdf from the .acsm file and
remove the drm.
*/

function getBookId() {
	const pattern = new RegExp("^https://archive.org/details/([^/]+)(?:/|$)");
	const match = pattern.exec(window.location.toString());
	return match != null ? match[1] : null;
}

// Make sanitize a string for use as filename
function sanitizeFilename(filename) {
	filename = filename.replaceAll(/[\\\/:"*?<>|;]+/gi, " "); // Remove invalid characters
	filename = filename.replaceAll(/\s{2,}/g, " "); // Remove multiple consecutive whitspaces
	filename = filename.replaceAll(/^\s+|\s+$/g, ""); // Remove leading and trailing whitespaces
	return filename;
}

function downloadAcsm() {
		console.log("Downloading acsm");
		const bookId = getBookId();
		const acsmUrl = `https://archive.org/services/loans/loan/?action=media_url&identifier=${bookId}&format=pdf&redirect=1`;
		const itemTitle = document.querySelector("h1.item-title").textContent;
		const metadataUrl = `https://archive.org/download/${bookId}/${bookId}_meta.xml`;

		console.log("Metadata-url:", metadataUrl);
		console.log("acsm-url:", acsmUrl);

		// Download acsm file and metadata file
		GM_download(acsmUrl, `${sanitizeFilename(itemTitle)}.acsm`);
		const resp = GM_download(metadataUrl, `${sanitizeFilename(itemTitle)}.xml`);
		console.log(resp);
		setTimeout(() => { console.log(resp) }, 3000);
}

function checkIfInBorrowedBooksCollection() {
	const collectionLinkElements = document.querySelectorAll(".collection-list .collection-item>a");
	for(const el of collectionLinkElements) {
		if(el.textContent == "Books to Borrow") {
			return true;
		}
	}
	return false
}

(function() {
    'use strict';

	if(getBookId() != null && checkIfInBorrowedBooksCollection()) {
		const buttonContainer = document.querySelector("section.action-buttons-section");
		const button = GM_addElement(buttonContainer, "button", {class: "button", textContent: "Download acsm"});
		button.addEventListener("click", downloadAcsm);
	}
})();
