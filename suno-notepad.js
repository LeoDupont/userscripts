// ==UserScript==
// @name         Suno Notepad
// @namespace    https://github.com/LeoDupont/userscripts
// @version      1.1
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
	onUrlChange(mountNotepads);

	showManualRefreshButton();

	addGlobalStyles(`
		.suno-notepad {
			width: 30rem;
			margin: 0 1rem;
			background-color: #242a34;
			color: white;
		}

		.css-pjl8ph .suno-notepad {
			display: block;
			width: 100%;
			margin: 0.1rem 0;
		}

		.css-lw6smx .suno-notepad {
			display: block;
			margin: 0.1rem 0;
		}
	`);

})();

// =======================================================
// == Helpers
// =======================================================

async function mountNotepads() {

	// === Track Page ===

	var trackId = getTrackIdFromUrl(document.URL);
	if (trackId) {
		loadNotepad(trackId, (notepad) => {
			$('.css-lw6smx .css-1f0wxn3 p').prepend(notepad);
		});
	}

	// === Create & Library Pages ===

	var tracksElms = await waitForElms('.css-i7zi74');
	$(tracksElms).each(function (i, elm) {
		var trackId = elm.attributes['data-clip-id'].value;
		if (trackId) {
			loadNotepad(trackId, (notepad) => {
				$(elm).find('.css-1fq6tx5').append(notepad);
			});
		}
	});
}

function getTrackIdFromUrl(url) {
	var match = url.match(/\/([\w-]{36})/);
	if (match) {
		return match[1];
	}
}

function onUrlChange(callback) {
	var currentLocation = location.href;

	new MutationObserver(mutations => {
		if (currentLocation !== location.href) {
			currentLocation = location.href;
			callback();
		}
	}).observe(document.body, {
		childList: true,
		subtree: false
	});
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

function loadNotepad(trackId, callback) {
	const inputId = 'suno-notepad-' + trackId;

	if ($("#" + inputId).length != 0) {
		return;
	}

	const trackNotes = loadNotes(trackId);

	const notepad = $('<input>')
		.attr({
			id: inputId,
			class: 'suno-notepad',
			name: 'suno-notepad',
			value: trackNotes,
			placeholder: 'Notepad...',
			autocomplete: 'off',
		})
		.keyup(function (e) {
			var newNotes = e.target.value;
			console.log('[SUNO NOTEPAD] Storing new notes for ' + trackId + ': ' + newNotes);
			saveNotes(trackId, newNotes);
		});

	callback(notepad);
}

function showManualRefreshButton() {
	$('<button>')
		.attr({
			id: 'suno-notepad-manual-refresh',
			style: 'display: float; position: fixed; bottom: 1rem; right: 1rem;',
			title: 'Notepad Refresh',
			type: 'button',
		})
		.text('Notepad Refresh')
		.appendTo(document.body)
		.click(function (e) {
			mountNotepads();
		});
}

function addGlobalStyles(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
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
