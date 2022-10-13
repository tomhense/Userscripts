// ==UserScript==
// @name         Auto zoom lone videos
// @version      3
// @author       Codedotexe
// @description  Automatically zoom small standalone videos
// @match        *://*/*.mp4
// @match        *://*/*.webm
// @match        *://*/*.mkv
// @match        *://*/*.m4a
// @match        *://*/*.avi
// @run-at       window-load
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/Codedotexe/Userscripts/main/AutoZoomLoneVideos.js
// @updateURL    hhttps://raw.githubusercontent.com/Codedotexe/Userscripts/main/AutoZoomLoneVideos.js
// ==/UserScript==

'use strict';

function resize(video) {
	video.width = window.innerWidth;
	video.height = window.innerHeight;
}

(function() {
	const isToplevelVideo = document.querySelector("head link[href='resource://content-accessible/TopLevelVideoDocument.css']") != null;

	if(isToplevelVideo) {
		const video = document.querySelector("video");
		const aspectRatio = video.videoWidth / video.videoHeight;
		video.loop = true; // Enable looping

		window.addEventListener("resize", () => {
			resize(video);
		});

		resize(video);
	}
})();
