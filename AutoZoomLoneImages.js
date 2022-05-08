// ==UserScript==
// @name           Auto zoom lone images
// @version        5
// @author         Codedotexe
// @description    Automatically zoom small standalone images
// @include        /^https?:\/\/.*\.(jpe?g|gif|png).*$/
// @run-at         window-load
// @grant          GM_addStyle
// @downloadURL    https://raw.githubusercontent.com/Codedotexe/Userscripts/main/AutoZoomLoneImages.js
// @updateURL      https://raw.githubusercontent.com/Codedotexe/Userscripts/main/AutoZoomLoneImages.js
// ==/UserScript==

'use strict';

class DragHandler {
	constructor(target, targetButton, callback) {
		this.target = target; // target element
		this.targetButton = targetButton; // which mouse button to respond to
		this.callback = callback;
		this.dx;
		this.dy;
		this.isMouseDown = false;
		this.addEventListeners();
	}

	addEventListeners() {
		this.target.addEventListener("mousedown", this.mouseDown.bind(this));
		this.target.addEventListener("mouseup", this.mouseUp.bind(this));
		this.target.addEventListener("mousemove", this.mouseMove.bind(this));
	}

	mouseDown(ev) {
		if(ev.button == this.targetButton) {
			this.isMouseDown = true;
			this.dx = ev.x;
			this.dy = ev.y;
		}
	}

	mouseMove(ev) {
		if(this.isMouseDown) {
			this.callback(ev.x - this.dx, ev.y - this.dy);
			this.dx = ev.x;
			this.dy = ev.y;
		}
	}

	mouseUp(ev) {
		if(ev.button == this.targetButton) {
			this.isMouseDown = false;
		}
	}
}

function setSize(image, width, height, xOff, yOff) {
	image.style.left = xOff + "px";
	image.style.top = yOff + "px";
	image.width = width;
	image.height = height;
}


(function() {
	const isToplevelImage = document.querySelector("head link[href='resource://content-accessible/TopLevelImageDocument.css']") != null;

	if(isToplevelImage) {
		// Replace with clone so that default zoom function is disabled
		const image = document.querySelector("img").cloneNode();
		document.querySelector("img").replaceWith(image);

		const aspectRatio = image.naturalWidth / image.naturalHeight;
		let width, height, xOff, yOff;
		let currentMode;
		let freeMoveActive = false;

		// Switch to the next mode
		function nextMode(ev, cond) {
			if(cond(ev)) {
				ev.preventDefault();

				// If freeMove active disable it and appy the current mode (don't switch)
				if(freeMoveActive) {
					freeMoveActive = false;
				} else { // else switch to next mode
					currentMode++;
					currentMode %= 2;
				}
				setMode()
				setSize(image, width, height, xOff, yOff);
			}
		}

		// Set mode
		function setMode() {
			if(currentMode == 0) { // Fit to width
				width = window.innerWidth;
				height = window.innerWidth / aspectRatio;
				xOff = 0;
				yOff = (window.innerHeight - window.innerWidth/aspectRatio)/2;
			} else if(currentMode == 1) { // Fit to height
				width = window.innerHeight * aspectRatio;
				height = window.innerHeight;
				xOff = (window.innerWidth - window.innerHeight*aspectRatio)/2;
				yOff = 0;
			}
		}

		GM_addStyle(`
			* { scrollbar-width: none; }
			img {
				position: absolute;
				cursor: inherit !important;
			}
		`);

		new DragHandler(document, 1, (dx, dy, ev) => { // Zoom
			freeMoveActive = true;
			height += dy;
			width += dy * aspectRatio;

			// Keep image centered
			yOff -= dy / 2;
			xOff -= dy * aspectRatio / 2;

			setSize(image, width, height, xOff, yOff);
		});

		new DragHandler(document, 0, (dx, dy) => { // Pan
			freeMoveActive = true;
			xOff += dx;
			yOff += dy;
			setSize(image, width, height, xOff, yOff);
		});

		image.addEventListener('dragstart', (ev) => { // Disable image drag
			ev.preventDefault(); }
		);

		// Switch to next mode when pressing the space key
		document.addEventListener('keydown', (ev) => nextMode(
			ev,
			(ev) => { return ev.code == "Space"; }
		));

		// Switch to next mode when pressing the middle mouse button
		/*
		document.addEventListener('mousedown', (ev) => nextMode(
			ev,
			(ev) => { return ev.buttons == 4; })
		);
		*/

		// Handle window resize
		window.addEventListener('resize', () => {
			setMode()
			setSize(image, width, height, xOff, yOff);
		});

		// Find out if fit-to-height or fit-to-width fits better
		if(window.innerWidth < window.innerHeight * aspectRatio) {
			currentMode = 0; // Fit to width
		} else {
			currentMode = 1; // Fit to height
		}

		// Apply initial settings
		setMode()
		setSize(image, width, height, xOff, yOff);
	}
})();
