// ==UserScript==
// @name         Google Calendar User Redirect
// @description  Redirects from user 0 to user X in Calendar
// @namespace    https://github.com/LeoDupont/userscripts
// @match        https://calendar.google.com/calendar/u/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg
// @grant        none
// @version      1.1
// @author       LeoDupont
// @description  22/02/2024 16:42:29
// ==/UserScript==

const USER_TO_REDIRECT_TO = 1;

const url = location.href;
const match = url.match(
	/(https:\/\/calendar\.google\.com\/calendar\/u\/)(0)(.*)/
);
if (!match) {
	return;
}

const newUrl = match[1] + USER_TO_REDIRECT_TO + match[3];
location.href = newUrl;
