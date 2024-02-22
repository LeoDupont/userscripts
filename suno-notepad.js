// ==UserScript==
// @name         Suno Notepad
// @namespace    https://github.com/LeoDupont/userscripts
// @version      0.1
// @description  Lets you annotate Suno tracks. Uses localStorage.
// @author       LeoDupont
// @match        https://app.suno.ai/*
// @icon         https://app.suno.ai/logo2.svg
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==

////////////////////////////////////////////////////////////////////
// Suno Notepad
//
// Displays a simple text input on each track
//  * on the tracks list
//  * on each track's page
//
// Uses the browser's localStorage to store notes.
// => notes are not synced anywhere on the Internet.
////////////////////////////////////////////////////////////////////

var $ = window.$; // Declaration

(async function () {
	'use strict';

	mountNotepads();

	// === Listen to URL changes ===
	var currentLocation = location.href;

	new MutationObserver(mutations => {
		if (currentLocation !== location.href) {
			currentLocation = location.href;
			mountNotepads();
		}
	}).observe(document.body, {
		childList: true,
		subtree: false
	});

})();

// =======================================================
// == Helpers
// =======================================================

async function mountNotepads() {

	// === Track Page ===

	var trackId = getTrackIdFromUrl(document.URL);
	if (trackId) {
		var trackNotes = loadNotes(trackId);
		showNotepad(trackId, trackNotes, 'h2.chakra-heading');
	}

	// === Create & Library Pages ===

	var tracksElms = await waitForElms('.css-i7zi74');
	$(tracksElms).each(function (i, elm) {
		var trackId = elm.attributes['data-clip-id'].value;
		if (trackId) {
			var trackNotes = loadNotes(trackId);
			showNotepad(trackId, trackNotes, $(elm).find('.css-1fq6tx5'));
		}
	});

	// === Library Page ===
}

function getTrackIdFromUrl(url) {
	var match = url.match(/\/([\w-]{36})/);
	if (match) {
		return match[1];
	}
}

function waitForElms(selector) {
	return new Promise(resolve => {
		if (document.querySelectorAll(selector).length > 0) {
			return resolve(document.querySelectorAll(selector));
		}

		const observer = new MutationObserver(mutations => {
			if (document.querySelectorAll(selector).length > 0) {
				// observer.disconnect();
				resolve(document.querySelectorAll(selector));
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	});
}

// =======================================================
// == UI
// =======================================================

function showNotepad(trackId, value, elmToAppendTo) {
	const inputId = 'suno-notepad-' + trackId;

	if ($("#" + inputId).length != 0) {
		return;
	}

	$('<input>')
		.attr({
			id: 'suno-notepad-' + trackId,
			name: 'suno-notepad',
			style: 'width: 30rem; margin: 0 1rem; background-color: #242a34; color: white;',
			value: value,
			placeholder: 'Notepad...',
			autocomplete: 'off',
		})
		.appendTo(elmToAppendTo)
		.keyup(function (e) {
			var newNotes = e.target.value;
			console.log('[SUNO NOTEPAD] Storing new notes for ' + trackId + ': ' + newNotes);
			saveNotes(trackId, newNotes);
		});
}

// =======================================================
// == Storage
// =======================================================

function loadNotes(elmId) {
	return localStorage.getItem('notepad-' + elmId);
}

function saveNotes(elmId, notes) {
	localStorage.setItem('notepad-' + elmId, notes);
}
