import * as Common from '../modules/common';
import _ from '../modules/_';
import BaseParser from './Parser';

class Parser extends BaseParser {

    constructor (url, isChapter) {
        super('e_hentai_org', url);

        this.pageCollections = { };
        this.gPreviewCount = 40;

        return this.init();
    }

    init() {
        return new Promise((resolve, reject) => {
            this.parseDocument();
            resolve(this);
        });
    }

    parsePageLinks(index, galleryPageDom) {
        console.log(index);
        let elements = galleryPageDom.querySelectorAll('.gdtm');
        let i = 1;
        elements.forEach((element) => {
            this.pageCollections[index * this.gPreviewCount + i] = element.querySelector('a').getAttribute('href');
            i++;
        });
    }

    /**
     * 获得预览分页信息
     * @param {*string} page 漫画的分页
     */
    parsePageLinksByPage(page) {
        let _this = this;
        let gPreviewPage = Math.floor(page / this.gPreviewCount);
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', this.getGPageUrlByPage(gPreviewPage));
            xhr.responseType = "document";
            xhr.onload = () => {
                _this.parsePageLinks(gPreviewPage, xhr.responseXML);
            };
            xhr.onerror = () => reject(xhr.statusText);
            xhr.send();
        });
    }

    /**
     * 主要用于解析出总页数this.totalPage
     */
    parseDocument() {
        this.parsePageLinks(0, document); // 解析第一页中的分页信息
        let $gdt2 = document.querySelectorAll('.gdt2');
        $gdt2.forEach((element) => {
            let matches = [];
            if (matches = element.innerHTML.match(/(\d+)\s?pages/i)) {
                this.totalPage = matches[1];
            }
        });
    }

    getImgSrc(page, callback, context) {
        this.requestImgSrc(page).then((src) => {
            callback.call(context, page, src);
        });
    }

    getGPageUrlByPage(page) {
        return this.url + '?p=' + page;
    }

    getPageUrlByPage(page) {
        return this.pageCollections[page];
    }

    /**
     * 
     * @param {*string} page 漫画的分页
     * @return Promise
     */
    requestImgSrc(page) {
        let _this = this;
        return new Promise((resolve, reject) => {
            if (this.datasets[page] && this.datasets[page].status === this.COMPLETED) {
                resolve(this.datasets[page].src);
            } else if (!(this.datasets[page] && this.datasets[page].status === this.PROCESSING)) {
                if (!this.datasets[page])
                    this.datasets[page] = {};

                /* 分页是否已经解析 */
                if (undefined == this.pageCollections[page]) {
                    /* 解析分页信息 */
                    this.parsePageLinksByPage(page).then(() => {
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
                    }, () => {
                        reject(_('network_issue'));
                    })
                } else {
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
            }
        });
    }

}

export default Parser;