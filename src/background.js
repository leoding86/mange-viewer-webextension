import { Matcher, TabStack } from './modules/common';

var matcher = new Matcher();
var tabStack = new TabStack();

chrome.webRequest.onCompleted.addListener((details) => {
    matcher.setUrl(details.url);
    if (name = matcher.is()) {
        if (details.tabId > 1) {
            chrome.tabs.executeScript(details.tabId, {file: './build/bundle.injectscript.js'});

            tabStack.add(
                details.tabId,
                { parser: name, site: matcher.site(name), url: details.url }
            );
        }
    }
}, { urls: [ "<all_urls>" ], types: [ "main_frame" ] });

chrome.tabs.onRemoved.addListener((tabId) => {
    tabStack.delete(tabId);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.from === 'popup' && request.data.op === 'needData') {
        var responseData = tabStack.get(request.data.tabId);
        if (responseData) {
            sendResponse({ data: responseData });
        }
    } else if (request.from === 'frontpage' && request.data.op === 'setComicTitle') {
        tabStack.set(sender.tab.id, 'title', request.data.title);
    }
});