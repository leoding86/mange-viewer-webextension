import * as Common from '../modules/common';
import _ from '../modules/_';
import XHR from '../modules/XHR';
import BaseParser from './Parser';

class Parser extends BaseParser {

    constructor (url) {
        super('dm5_com', url);
        this.cid = null;
        this.mid = null;
        this.uid = 0;

        this.parseUrl();
        return this.init();
    }

    init () {
        let _this = this;
        return new Promise((resolve, reject) => {
            _this.parseDocument(document.body.innerHTML);
            resolve(_this);
        });
    }

    parseDocument (responseText) {
        /* 分析页数 */
        let matches = /DM5_IMAGE_COUNT\s?=\s?([\d]+)/.exec(responseText);
        this.totalPage = matches[1];
        matches = /DM5_MID\s{0,}=\s{0,}([\d]+)/.exec(responseText);
        this.mid = matches[1];
        matches = /DM5_USERID\s{0,}?=\s{0,}([\d]+)/.exec(responseText);
        this.uid = matches[1];
    }

    parseUrl () {
        let matches = this.pattern.exec(this.url);
        this.cid = matches[1];
    }

    /**
     * must implemenet method
     * @return {[type]} [description]
     */
    getImgSrc (page, callback, context) {
        this.sendHistoryRequest(page);
        this.requestImgSrc(page).then((src) => {
            callback.call(context, page, src);
        });
    }

    getHistoryUrlByPage (page) {
        return this.getSiteurl() + '/m' + this.cid + '/history.ashx?cid=' + this.cid + '&mid=' + this.mid + '&page=' + page + '&uid=' + this.uid + '&language=1';
    }

    sendHistoryRequest (page) {
        let xhr = XHR();
        xhr.open('GET', this.getHistoryUrlByPage(page));
        xhr.send(null);
    }

    getChapterfunUrlByPage (page) {
        return this.getSiteurl() + '/m' + this.cid + '/chapterfun.ashx?cid=' + this.cid + '&page=' + page + '&key=&language=1&gtk=6';
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
                let chapterfun = this.getChapterfunUrlByPage(page);
                let xhr = XHR();
                xhr.open('GET', chapterfun);
                xhr.onload = () => {
                    let script = xhr.responseText;
                    let result = eval(xhr.responseText); // danger but only way to get src of image
                    try {
                        this.datasets[page] = {
                            status: _this.COMPLETED,
                            src: result[0]
                        };
                        resolve(result[0]);
                    } catch (e) {
                        reject(_('refresh_target_page'));
                    }
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

export { Parser }