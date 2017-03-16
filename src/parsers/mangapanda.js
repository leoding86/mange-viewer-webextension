import * as Common from '../modules/common';
import _ from '../modules/_';
import BaseParser from './Parser';

class Parser extends BaseParser {

    constructor (url) {
        super(
            url,
            'http://www.mangapanda.com',
            'http://s5.mangapanda.com/sup/images/dark.813ab89088.png',
            ['*://*.mangapanda.com/*']);

        return this.init();
    }

    init () {
        let _this = this;
        this.url = Common._r.mangapanda.exec(this.url)[1];
        return new Promise((resolve, reject) => {
            this.getDocument(this.url, resolve, reject);
        });
    }

    getDocument (url, resolve, reject) {
        let _this = this;
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function () {
            _this.parseDocument(xhr.responseText);
            resolve(_this);
        }
        xhr.onerror = function () {
            reject(e);
        }
        xhr.send(null);
    }

    parseDocument (responseText) {
        let matches = /<select[^>]+id="pageMenu"[^>]+>([\s\S]+?)<\/select>/.exec(responseText);
        let dom = document.createElement('div');
        dom.innerHTML = matches[1];
        this.totalPage = dom.querySelectorAll('option').length;
    }

    getImgSrc (page, callback, context) {
        this.requestImgSrc(page).then((src) => {
            callback.call(context, page, src);
        });
    }

    getPageUrlByPage (page) {
        return this.url + '/' + page;
    }

    requestImgSrc (page) {
        let _this = this;
        return new Promise((resolve, reject) => {
            if (this.datasets[page] && this.datasets[page].status === this.COMPLETED) {
                resolve(this.datasets[page].src);
            } else if (!(this.datasets[page] && this.datasets[page].status === this.PROCESSING)) {
                if (!this.datasets[page])
                    this.datasets[page] = {};

                this.datasets[page].status = this.PROCESSING;
                let pageurl = _this.getPageUrlByPage(page);
                let xhr = new XMLHttpRequest();
                xhr.open('GET', pageurl);
                xhr.onload = () => {
                    let matches = /<img[^>]+id="img"[^>]+src="([^"]+?)"[^>]+\/?>/.exec(xhr.responseText);
                    this.datasets[page] = {
                        status: _this.COMPLETED,
                        src: matches[1]
                    }
                    resolve(matches[1]);
                };
                xhr.onerror = () => {
                    reject(_('network_issue'));
                }
                this.datasets[page].xhr = xhr;
                xhr.send(null);
            }
        });
    }

}

export { Parser };