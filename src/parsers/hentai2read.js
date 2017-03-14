import * as Common from '../modules/common';

function Parser(url) {
    this.url = url;
    this.mid = null;
    this.cdn = null;
    this.datasets = [];
    return this.init();
}

Parser.prototype.init = function() {
    let _this = this;
    chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
        details.requestHeaders.push({
            name: "Referer",
            value: _this.geturl()
        });
        let headers = details.requestHeaders;
        return { requestHeaders: headers };
    }, { urls: ['*://*.hentai2read/*'], types: ['xmlhttprequest'] }, [ 'requestHeaders', 'blocking' ]);

    return new Promise((resolve, reject) => {
        if (Common._r.hentai2read.test(this.url)) {
            this.getDocument(this.url, resolve, reject);
        }
    });
}

/**
 * must implemenet
 * @return {[type]} [description]
 */
Parser.prototype.geturl = function() {
    return this.url;
}

/**
 * must implemenet
 * @return {[type]} [description]
 */
Parser.prototype.getSiteurl = function() {
    return 'http://hentai2read.com';
}

/**
 * must implemenet
 * @return {[type]} [description]
 */
Parser.prototype.getSitelogo = function() {
    return 'https://hentaicdn.com/cdn/v2/assets/img/favicons/favicon-192x192.png';
}

/**
 * must implemenet
 * @return {[type]} [description]
 */
Parser.prototype.getImgSrc = function(page, callback, context) {
    callback.call(context, page, this.datasets[page - 1]);
}

/**
 * must implemenet
 * @return {[type]} [description]
 */
Parser.prototype.getTotalPage = function() {
    return this.datasets.length;
}

/**
 * must implemenet
 * @return {[type]} [description]
 */
Parser.prototype.isValidIndex = function(index) {
    return index <= (this.datasets.length - 1);
};

Parser.prototype.getDocument = function(url, resolve, reject) {
    let _this = this;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function () {
        _this.parseProp(xhr.responseText);
        _this.parseDocument(xhr.responseText);
        resolve(_this);
    }
    xhr.onerror = function (e) {
        reject(e);
    }
    xhr.send(null);
};

Parser.prototype.parseProp = function(responseText) {
    let reg = /<img\s+id="arf-reader"\s+src="([^"]+)\/(\d+)\/\d+\/[^"\/]+"/;
    let matches = reg.exec(responseText);
    this.cdn = (matches[1].indexOf('http') == 0 ? '' : 'http:') + matches[1];
    this.mid = matches[2];
};

Parser.prototype.parseDocument = function(responseText) {
    let reg = /['"]images['"]\s+:\s+(\[[^\[\]]+\])/i;
    let matches = reg.exec(responseText);
    let images = JSON.parse(matches[1]);

    images.forEach((image) => {
        this.datasets.push(this.cdn + image);
    });
    // let result;
    // while ((result = reg.exec(responseText)) !== null) {
    //     this.datasets.push(result[1]);
    // }
};

export { Parser }