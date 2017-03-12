function badge(tabId) {
    this.tabId = tabId;
    this.bgColor = [21, 158, 221, 255];
    this.text = '';
}

badge.prototype.setText = function(text) {
    chrome.browserAction.setBadgeText({text: this.text, tabId: this.tabId});
}

badge.prototype.setBgColor = function(color) {
    chrome.browserAction.setBadgeBackgroundColor({color: this.bgColor, tabId: this.tabId});
}

chrome.webRequest.onCompleted.addListener(function(details) {
    chrome.tabs.executeScript(details.tabId, {file: 'scripts/common.js'});
    chrome.tabs.executeScript(details.tabId, {file: 'scripts/injectMain.js'});
}, {urls: ["*://g.e-hentai.org/g/*/*", "*://exhentai.org/g/*/*"]});

/* 监听消息 */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.messageType == 'OpenReaderMessage') {
        var readerPage = getReaderPage(message.message);
        console.log(readerPage);
        chrome.tabs.create({url: readerPage});
    }
});