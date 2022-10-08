// ==UserScript==
// @name           Auto zoom lone images
// @version        7
// @author         Codedotexe
// @description    Automatically zoom small standalone images
// @include        /^https?:\/\/.*$/
// @run-at         window-load
// @grant          GM.xmlHttpRequest
// @grant          GM_addStyle
// @connect        unpkg.com
// @downloadURL    https://raw.githubusercontent.com/Codedotexe/Userscripts/main/AutoZoomLoneImages.js
// @updateURL      https://raw.githubusercontent.com/Codedotexe/Userscripts/main/AutoZoomLoneImages.js
// ==/UserScript==

/*
Uses https://github.com/timmywil/panzoom
*/

'use strict';

let curZoomMode = "min";

// Fetch text from a url
function fetchText(url) {
	return GM.xmlHttpRequest({
		method : "GET",
		url : url,
		onload : (ev) => {
			if(ev.status == 200)
				Promise.resolve(ev.responseText);
			else
				Promise.reject("Invalid http status returned");
		}
	});
}


function addTriggers(panzoom) {
	document.addEventListener('keydown', (ev) => {
		if(ev.code == "Space") {
			ev.preventDefault();
		}
	});
}

(function() {
	const isToplevelImage = document.querySelector("head link[href='resource://content-accessible/TopLevelImageDocument.css']") != null;

	if(isToplevelImage) {
		// Disable scroll bar and image magnifying lense
		GM_addStyle(`
			* { scrollbar-width: none; }
			img {
				position: absolute;
				cursor: inherit !important;
			}
		`);

		// Replace with clone so that default zoom function is disabled (maybe there is a better way?)
		const image = document.querySelector("img").cloneNode();
		const container = document.createElement("div");
		container.appendChild(image);
		document.body.appendChild(container);
		document.querySelector("img").remove();

		// Load a script and add it to the document
		fetchText("https://unpkg.com/@panzoom/panzoom@latest/dist/panzoom.min.js").then(html => {
			// Add the fetched js to the document as a script element
			const scriptElem = document.createElement('script');
			scriptElem.innerText = html.responseText;
			document.head.appendChild(scriptElem);

			console.log("Script loaded");

			// Panzoom only becomes available after script load
			const panzoom = Panzoom(image, {
				maxScale: 5
			});
			console.log(panzoom);
			image.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);
		}).catch(console.log); // Error occured
	}
})();
