import { Matcher, TabStack } from './modules/common';

var matcher = new Matcher();
var tabStack = new TabStack();

chrome.webRequest.onCompleted.addListener((details) => {
    matcher.setUrl(details.url);
    if (name = matcher.is()) {
        if (details.tabId > 1) {
            /* Change icon to active one */
            setTimeout(() => {
                chrome.browserAction.setIcon({
                    path: {
                        '38': '../assets/icon.png'
                    },
                    tabId: details.tabId
                }, () => { console.log('icon has been setted') });
            }, 100);
            tabStack.add(
                details.tabId,
                {
                    parser: name,
                    site: matcher.site(name).site,
                    url: details.url,
                    logo: matcher.site(name).logo
                }
            );

            chrome.tabs.executeScript(details.tabId, { file: './build/bundle.app_cvr.js' });
        }
    }
}, { urls: [ "<all_urls>" ], types: [ "main_frame" ] });

chrome.tabs.onRemoved.addListener((tabId) => {
    tabStack.delete(tabId);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.from === 'popup' && request.data.op === 'needData') {
        var responseData = tabStack.get(request.data.tabId);
        if (responseData !== null) {
            sendResponse({ data: responseData });
        }
    }
});