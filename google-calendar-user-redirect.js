// ==UserScript==
// @name         Google Calendar User Redirect
// @description  Redirects from user 0 to user X in Calendar
// @namespace    https://github.com/LeoDupont/userscripts
// @match        https://calendar.google.com/calendar/u/*
// @grant        none
// @version      1.0
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
