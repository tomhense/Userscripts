// ==UserScript==
// @name           Auto zoom lone images
// @version        9
// @author         Codedotexe
// @description    Automatically zoom small standalone images
// @include        /^https?:\/\/.*$/
// @run-at         window-load
// @grant          GM_addStyle
// @require        https://unpkg.com/panzoom@9.4.3/dist/panzoom.min.js
// @downloadURL    https://raw.githubusercontent.com/Codedotexe/Userscripts/main/AutoZoomLoneImages.js
// @updateURL      https://raw.githubusercontent.com/Codedotexe/Userscripts/main/AutoZoomLoneImages.js
// ==/UserScript==

'use strict';

function zoomToFill(instance) {
	instance.pause();
	const zoomable = document.querySelector(".zoomable");

	const image = document.querySelector("img");

	const zoomFactor = zoomable.clientHeight / image.clientHeight;
	const offsetX = (1-zoomFactor) * zoomable.clientWidth /2;
	const offsetY = (1-zoomFactor) * zoomable.clientHeight /2;

	instance.zoomAbs(0, 0, zoomFactor);
	instance.moveTo(offsetX, offsetY);
	instance.resume();
}

function zoomToFit(instance) {
	instance.pause();
	instance.zoomAbs(0, 0, 1);
	instance.moveTo(0, 0);
	instance.resume();
}

function showImageInfo() {
	if(document.getElementById("infoElement")) {
		document.getElementById("infoElement").remove();
	} else {
		const image = document.querySelector("img");
		const infoElement = document.createElement("div");
		infoElement.id = "infoElement";
		infoElement.innerHTML = `<p>Width: ${image.naturalWidth}px</p><p>Height: ${image.naturalHeight}px</>`;
		document.body.appendChild(infoElement);
	}
}

function addTriggers(instance) {
	document.addEventListener('keydown', (ev) => {
		if(ev.code == "Space" && !ev.shiftKey) {
			ev.preventDefault();
			zoomToFit(instance);
		} else if(ev.code == "Space" && ev.shiftKey) {
			ev.preventDefault();
			zoomToFill(instance);
		} else if(ev.code== 'KeyQ') {
			ev.preventDefault();
			showImageInfo();
		}
	});
	document.addEventListener('mousedown', (ev) => {
		if(ev.buttons == 4) { // Middle mouse button
			ev.preventDefault();
			zoomToFit(instance);
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
			.zoomable {
				width: 100vw;
				height: 100vh;
			}
			#infoElement {
				position: absolute;
				top: 0;
				left: 0;
				font-family: sans-serif;
				border: 5px solid black;
				background-color: white;
				color: black;
				padding: 0 1em 0 1em;
			}
		`);

		// Replace with clone so that default zoom function is disabled (maybe there is a better way?)
		const imageElement = document.querySelector("img").cloneNode();

		const imageContainer = document.createElement("div");
		imageContainer.classList.add("zoomable");
		imageContainer.appendChild(imageElement);

		document.querySelector("img").replaceWith(imageContainer);

		const instance = panzoom(imageContainer, {
			filterKey: () => { return true }, // Don't use keyboard shortcuts
			bounds: true, // Whether to have a bouding box
			boundsPadding: 0.05,
			minZoom: 0.5,
			maxZoom: 10
		});
		console.log(instance);
		addTriggers(instance);
	}
})();
