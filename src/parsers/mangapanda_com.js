import * as Common from '../modules/common';
import _ from '../modules/_';
import BaseParser from './Parser';

class Parser extends BaseParser {

    constructor (url) {
        super('mangapanda_com', url);
        return this.init();
    }

    init () {
        this.url = this.pattern.exec(this.url)[1];
        return new Promise((resolve, reject) => {
            this.parseDocument();
            resolve(this);
        });
    }

    parseDocument () {
        let $pageMenu = document.body.querySelector('#pageMenu');
        this.totalPage = $pageMenu.querySelectorAll('option').length;
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