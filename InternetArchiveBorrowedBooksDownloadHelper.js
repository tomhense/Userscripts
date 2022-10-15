// ==UserScript==
// @name         Internet Archive borrowed books download helper
// @descriptino  Adds an button on Archive.org borrowed books pages to download .acsm files
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       Codedotexe
// @match        https://archive.org/details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archive.org
// @grant        GM_download
// @grant        GM_addElement
// @grant        GM_setClipboard
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

function getItemTitle() {
	return document.querySelector("h1.item-title").textContent;
}

function downloadAcsm() {
		console.log("Downloading acsm");
		const bookId = getBookId();
		const acsmUrl = `https://archive.org/services/loans/loan/?action=media_url&identifier=${bookId}&format=pdf&redirect=1`;
		const metadataUrl = `https://archive.org/download/${bookId}/${bookId}_meta.xml`;

		console.log("Metadata-url:", metadataUrl);
		console.log("acsm-url:", acsmUrl);

		// Download acsm file and metadata file

		// Available formats: bookreader, pdf, epub, lcp_pdf

		GM_download(acsmUrl, `${sanitizeFilename(getItemTitle)}.acsm`);
		const resp = GM_download(metadataUrl, `${sanitizeFilename(getItemTitle)}.xml`);
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

function initImageRipper() {
	// Extract one image url from book viewer which will be used for templating
	const brImgElement = document.querySelector(".BRcontainer img.BRpageimage");
	const brSrc = brImgElement.src;
	console.log("Brsrc", brSrc);

	// Extract min and max page number from book viewer
	const brCurrentPage = document.querySelector("span.BRcurrentpage").textContent;
	const brCurrentPageMatch = /\((\d+) of (\d+)\)/.exec(brCurrentPage);
	const minPage = parseInt(brCurrentPageMatch[1]);
	const maxPage = parseInt(brCurrentPageMatch[2]);

	// Get item title
	const itemTitleSanitized = sanitizeFilename(getItemTitle());

	// Create a list of shell commands
	const shellCommands = [
		`mkdir '${itemTitleSanitized}'`,
		`pushd '${itemTitleSanitized}'`
	];

	for(let i=minPage; i<=maxPage; i++) {
		const indexPadded = String(i).padStart(4, "0");
		const imageSrc = brSrc.replace(/_\d+\.jp2/, `_${indexPadded}.jp2`);

		shellCommands.push(`curl -sf -H 'Origin: https://archive.org' -H 'User-Agent: ${window.navigator.userAgent}' -H 'Cookie: ${document.cookie}' '${imageSrc}' -o '${indexPadded}.jpg'`);
	}

	shellCommands.push(`for i in *.jpg; do convert "$i" "\${i%.jpg}.pdf"; done`);
	shellCommands.push(`pdfunite *.pdf "${itemTitleSanitized}.pdf"`);
	shellCommands.push("popd");

	// Copy the shell commands to the clipboard
	GM_setClipboard(shellCommands.join("\n"), "{type: 'text', mimetype: 'text/plain'}")

}

(function() {
    'use strict';

	if(getBookId() != null && checkIfInBorrowedBooksCollection()) {
		const buttonContainer = document.querySelector("section.action-buttons-section");

		const downloadAcsmButton = GM_addElement(buttonContainer, "button", {class: "button", textContent: "Download acsm"});
		downloadAcsmButton.addEventListener("click", downloadAcsm);

		const imageRipperButton = GM_addElement(buttonContainer, "button", {class: "button", textContent: "Rip images"});
		imageRipperButton.addEventListener("click", initImageRipper);
	}
})();
