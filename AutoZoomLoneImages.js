// ==UserScript==
// @name           Auto zoom lone images
// @version        8
// @author         Codedotexe
// @description    Automatically zoom small standalone images
// @include        /^https?:\/\/.*$/
// @run-at         window-load
// @grant          GM.xmlHttpRequest
// @grant          GM_addStyle
// @require        https://unpkg.com/panzoom@9.4.0/dist/panzoom.min.js
// @downloadURL    https://raw.githubusercontent.com/Codedotexe/Userscripts/main/AutoZoomLoneImages.js
// @updateURL      https://raw.githubusercontent.com/Codedotexe/Userscripts/main/AutoZoomLoneImages.js
// ==/UserScript==

'use strict';

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

		const instance = panzoom(image, {
			filterKey: () => { return true }, // Don't use keyboard shortcuts
			bounds: true, // Have a bouding box
			boundsPadding: 0.05,
			transformOrigin: {x: 0.5, y: 0.5} // Fixed transform origin at the center of the screen
		});
		console.log(instance);
		addTriggers(instance);
	}
})();
