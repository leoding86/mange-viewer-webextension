import * as Common from '../modules/common';
import _ from '../modules/_';

function Parser(url) {
    this.url = url;
    this.datasets = [];
    return this.init();
}

Parser.prototype.init = function () {
    let _this = this;
    
    return new Promise((resolve, reject) => {
        let matches = this.url.match(Common._r.readcomiconline);
        if (matches) {
            this.getDocument(matches[0] + '&readType=1', resolve, reject);
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
    return 'http://readcomiconline.to';
}

Parser.prototype.getSitelogo = function () {
    return 'http://readcomiconline.to/Content/images/logo.png';
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
        if (xhr.responseURL.indexOf('Special/AreYouHuman') > -1) {
            reject(_('check_issue'));
        }

        if ((xhr.status + "").indexOf("5") == 0) {
            reject(_('refresh_target_page'));
        } else {
            _this.parserDocument(xhr.responseText);
            resolve(_this);
        }
    }
    xhr.onerror = function (e) {
        reject(e);
    }
    xhr.send(null);
}

Parser.prototype.parserDocument = function(responseText) {
    let reg = /lstImages\.push\("([^()]+)"\)/ig
    let result;
    while ((result = reg.exec(responseText)) !== null) {
        this.datasets.push(result[1]);
    }
}

export { Parser }