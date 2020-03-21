'use strict';

// switch extension status by icon click
var state = 1;
chrome.browserAction.onClicked.addListener(function(tab) {
	state = !state;
	if (state) {
		console.log('sbn_redirect is on');
		chrome.browserAction.setIcon({path: "icons/sbn_on.png"});
	} else {
		console.log('sbn_redirect is off');
		chrome.browserAction.setIcon({path: "icons/sbn_off.png"});
	}
});

// check if host is 'fastpic.ru' and url ends with '.html'
chrome.webNavigation.onCommitted.addListener(function(obj) {
	// parse the current url
	var s = obj.url.split('/');
	console.log('s = ', s)
	// generate the link to full image
	// old redirect, might not work anymore but leaving just in case
	var ss = s[7].split('.');
	var new_url = [s[0], s[1], 'i'+s[4]+'.'+s[2], 'big', s[5], s[6], ss[0].slice(-2), ss[0]+'.'+ss[1]].join('/');
	// UPD 03.2020: change 'view' to 'fullview' in url
	var full_url = [s[0], s[1], s[2], 'fullview', s[4], s[5], s[6], ss[0] + '.' + ss[1]].join('/');
	console.log('full_url = ', full_url)

	// start redirecting if status allows and add '?noht=1' flag if needed
	chrome.webNavigation.onDOMContentLoaded.addListener(function(tab) {
		if (state) {
			console.log('sbn: redirecting', tab.url, 'to', full_url);
			chrome.tabs.update(tab.tabId, {url: full_url});
//			if (tab.url.endsWith('?noht=1')) {
//				console.log('sbn: redirecting', tab.url, 'to', new_url);
//				chrome.tabs.update(tab.tabId, {url: new_url});
//			} else {
//				console.log('sbn: redirecting', tab.url, 'to', new_url+'?noht=1');
//				chrome.tabs.update(tab.tabId, {url: new_url+'?noht=1'});
//			}
		}
	}, {hostEquals: 'fastpic.ru', url: [{pathSuffix: s[7]}]});
}, {url: [{hostEquals: 'fastpic.ru', urlSuffix: '.html'}]});
