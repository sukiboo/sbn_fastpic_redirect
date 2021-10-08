// this extension skips advertisements on fastpic.ru and shows the full image
// upd: since the beginning of 2020 fastpic.ru have changed the path to files
// so now to obtain the link to the full image one needs simply to edit
// the url by replacing 'view' to 'fullview' and removing the '.html' suffix


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
chrome.webNavigation.onBeforeNavigate.addListener(function(tab) {

	// get the current url
	var cur_url = tab.url;
	console.log('cur_url:', cur_url);

	// remove '.html*' and change 'view' to 'fullview' in the url
	var new_url = cur_url.substring(0, cur_url.indexOf('.html')).replace('view', 'fullview');
	console.log('new_url:', new_url);

	// start redirecting if the status allows
	if (state) {
		console.log('sbn: redirecting', cur_url, 'to', new_url);
		chrome.tabs.update(tab.tabId, {url: new_url});
	}

}, {url: [{hostPrefix: 'fastpic', pathSuffix: '.html'}]});
