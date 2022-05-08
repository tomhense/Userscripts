// ==UserScript==
// @name           Auto zoom lone images
// @version        6
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
Uses https://github.com/anvaka/panzoom
*/

'use strict';

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

function addTriggers(instance) {
	document.addEventListener('keydown', (ev) => {
		if(ev.code == "Space") {
			ev.preventDefault();
			instance.moveTo(0, 0);
			instance.zoomAbs(0, 0, 1);
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
		document.querySelector("img").replaceWith(image);

		// Load a script and add it to the document
		fetchText("https://unpkg.com/panzoom@9.4.0/dist/panzoom.min.js").then((html) => {
			// Add the fetched js to the document as a script element
			const scriptElem = document.createElement('script');
			scriptElem.innerText = html.responseText;
			document.head.appendChild(scriptElem);

			console.log("Script loaded");

			// Only becomes available after script load
			const instance = panzoom(image, {
				filterKey: () => { return true }, // Don't use keyboard shortcuts
				bounds: true, // Have a bouding box
				boundsPadding: 0.05,
				transformOrigin: {x: 0.5, y: 0.5} // Fixed transform origin at the center of the screen
			});
			console.log(instance);
			addTriggers(instance);
		}).catch(console.log); // Error occured
	}
})();
