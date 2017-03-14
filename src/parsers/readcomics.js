import * as Common from '../modules/common';

function Parser(url) {
    this.url = url;
    this.datasets = [];
    return this.init();
}

Parser.prototype.init = function () {
    let _this = this;
    chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
        details.requestHeaders.push({
            name: "Referer",
            value: _this.geturl()
        });
        let headers = details.requestHeaders;
        return { requestHeaders: headers };
    }, { urls: ['*://*.readcomics.tv/*'], types: ['xmlhttprequest'] }, [ 'requestHeaders', 'blocking' ]);

    return new Promise((resolve, reject) => {
        let matches = this.url.match(Common._r.readcomics);
        if (matches) {
            this.getDocument(matches[0] + '/full', resolve, reject);
        }
    });
}

/**
 * must implemenet
 * @return {[type]} [description]
 */
Parser.prototype.geturl = function () {
    return this.url;
}

Parser.prototype.getSiteurl = function () {
    return 'http://readcomics.tv';
}

Parser.prototype.getSitelogo = function () {
    return 'http://www.readcomics.tv/images/site/front/logo4.png';
}

Parser.prototype.getImgSrc = function (page, callback, context) {
    callback.call(context, page, this.datasets[page - 1]);
}

Parser.prototype.getTotalPage = function () {
    return this.datasets.length;
}

Parser.prototype.isValidIndex = function (index) {
    return index <= (this.datasets.length - 1);
};

Parser.prototype.getDocument = function(url, resolve, reject) {
    let _this = this;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function () {
        _this.parserDocument(xhr.responseText);
        resolve(_this);
    }
    xhr.onerror = function (e) {
        reject(e);
    }
    xhr.send(null);
}

Parser.prototype.parserDocument = function(responseText) {
    let reg = new RegExp('<img[^\/]+src="([^"]+)"[^\/]+\/>', 'g');
    let result;
    while ((result = reg.exec(responseText)) !== null) {
        this.datasets.push(result[1]);
    }
}

export { Parser }