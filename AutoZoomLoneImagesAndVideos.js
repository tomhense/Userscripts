// ==UserScript==
// @name           Auto zoom lone images & videos
// @version        11
// @author         Codedotexe
// @description    Automatically zoom small standalone images
// @match          *://*/*
// @run-at         window-load
// @grant          GM_addStyle
// @require        https://unpkg.com/panzoom@9.4.3/dist/panzoom.min.js
// @downloadURL    https://raw.githubusercontent.com/Codedotexe/Userscripts/main/AutoZoomLoneImagesAndVideos.js
// @updateURL      https://raw.githubusercontent.com/Codedotexe/Userscripts/main/AutoZoomLoneImagesAndVideos.js
// ==/UserScript==

'use strict';

function imgZoomToFill(instance) {
	const zoomable = document.querySelector(".zoomable");
	const zoomableWidth = zoomable.clientWidth;
	const zoomableHeight = zoomable.clientHeight;

	const image = document.querySelector("img");

	const aspectRatioZoomable = zoomableWidth / zoomableHeight;
	const aspectRatioImage = image.naturalWidth / image.naturalHeight;

	let zoomFactor;
	if(aspectRatioZoomable < aspectRatioImage) {
		zoomFactor = zoomableHeight / image.clientHeight;
	} else {
		zoomFactor = zoomableWidth / image.clientWidth;
	}

	const offsetX = (1-zoomFactor) * zoomableWidth /2;
	const offsetY = (1-zoomFactor) * zoomableHeight /2;

	instance.pause();
	instance.zoomAbs(0, 0, zoomFactor);
	instance.moveTo(offsetX, offsetY);
	instance.resume();
}

function imgZoomToFit(instance) {
	instance.pause();
	instance.zoomAbs(0, 0, 1);
	instance.moveTo(0, 0);
	instance.resume();
}

function imgShowImageInfo() {
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

function imgAddTriggers(instance) {
	document.addEventListener('keydown', (ev) => {
		if(ev.code == "Space" && !ev.shiftKey) {
			ev.preventDefault();
			imgZoomToFit(instance);
		} else if(ev.code == "Space" && ev.shiftKey) {
			ev.preventDefault();
			imgZoomToFill(instance);
		} else if(ev.code== 'KeyQ') {
			ev.preventDefault();
			imgShowImageInfo();
		}
	});
	document.addEventListener('mousedown', (ev) => {
		if(ev.buttons == 4) { // Middle mouse button
			ev.preventDefault();
			imgZoomToFit(instance);
		}
	});
}

function vidResize(video) {
	video.width = window.innerWidth;
	video.height = window.innerHeight;
}

(function() {
	const isToplevelImage = document.querySelector("head link[href='resource://content-accessible/TopLevelImageDocument.css']") != null;
	const isToplevelVideo = document.querySelector("head link[href='resource://content-accessible/TopLevelVideoDocument.css']") != null;

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
		imgAddTriggers(instance);
	} else if(isToplevelVideo) {
		const video = document.querySelector("video");
		const aspectRatio = video.videoWidth / video.videoHeight;
		video.loop = true; // Enable looping

		window.addEventListener("resize", () => {
			vidResize(video);
		});

		vidResize(video);
	}
})();
