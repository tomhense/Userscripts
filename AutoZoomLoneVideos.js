// ==UserScript==
// @name           Auto zoom lone images
// @version        3
// @description    Automatically zoom small standalone images
// @include        /^https?://.*\.(jpe?g|gif|png).*$/
// @run-at         window-load
// ==/UserScript==

const img = document.images[0];
const iw = img.width;
const ih = img.height;
const ir = iw / ih;

function togglezoom() {
	if (img.width>iw || img.height>ih) {
		img.width = iw;
		img.height = ih;
		img.setAttribute("style","cursor:-moz-zoom-in");
	} else {
        zoomin();
    }
}

function zoomin() {
	const ww = window.innerWidth;
	const wh = window.innerHeight;

	if (iw<ww && ih<wh) {
		img.addEventListener("click", togglezoom, false);
		const zohw = wh * ir;

		if (zohw<=ww) {
			img.height = wh;
			img.width = img.height * ir;
			img.setAttribute("style","cursor:-moz-zoom-out");
		} else {
			img.width = ww;
			img.height = img.width / ir;
			img.setAttribute("style","cursor:-moz-zoom-out");
		}

	}

}

(function() {
    zoomin();
})();

