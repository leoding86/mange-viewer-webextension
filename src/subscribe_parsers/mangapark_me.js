import * as Common from '../modules/common';
import _ from '../modules/_';
import XHR from '../modules/XHR';
import BaseParser from './BaseParser';

class Parser extends BaseParser {

    constructor () {
        super('mangapark_me');

        return new Promise((resolve, reject) => {
            resolve(this);
        });
    }

    getMangaURL () {
        return [this.site, 'manga', this.id].join('/');
    }

    getChapterURL (chapterId) {
        return [this.site, 'manga', this.id, chapterId, 1].join('/');
    }

    sync () {
        return new Promise((resolve, reject) => {
            let xhr = XHR();
            xhr.open('get', this.getMangaURL());
            xhr.onload = (e) => {
                if (e.target.status != 200) {
                    reject(this.toJSON());
                    return;
                }

                if (this.parseDocument(xhr.responseText)) {
                    resolve(this.toJSON());
                }
            };
            xhr.onerror = () => {
                reject(this.toJSON());
            };
            xhr.send(null);
        });
    }

    saveSubscribe () {
        return new Promise((resolve, reject) => {
            let xhr = XHR();
            xhr.open('get', this.getMangaURL());
            xhr.onload = (e) => {
                if (e.target.status != 200) {
                    reject(_('subscribe_failed'));
                    return;
                }

                if (this.parseDocument(xhr.responseText)) {
                    this.lastestSavedChapterId = this.lastestChapterId
                    super.saveSubscribe(resolve, reject);
                } else {
                    reject(_('subscribe_failed'));
                }
            };
            xhr.onerror = () => {
                reject(_('subscribe_failed'));
            };
            xhr.send(null);
        });
    }

    /**
     * Parse document to get informations about lastestChapterId, lastestChapterTitle, title, lastTime
     * 
     * @param {string|Document} document
     * @param {function} done
     * @throws
     * @returns {Boolean}
     */
    parseDocument (document, done) {
        let dom = super.parseDocument(document);
        let streamEls = dom.querySelectorAll('.stream');

        if (streamEls.length < 1) {
            return null;
        }

        let streamEl = streamEls[streamEls.length - 1];
        let lastestChapterEls = streamEl.querySelectorAll('.chapter');

        if (lastestChapterEls.length < 1) {
            return null;
        }

        let lastestChapterEl = lastestChapterEls[0].querySelector('a');

        if (!lastestChapterEl) {
            return null;
        }

        this.setSubscribeInfoProperties(
            /(s\d+\/(?:.+\/)*c\d+(?:\.\d+)?)\/1?$/.exec(lastestChapterEl.getAttribute('href'))[1],  // lastestChapterId
            lastestChapterEl.parentNode.textContent.trim(),                                         // lastestChapterTitle
            dom.querySelector('.hd h1').textContent.trim().replace(/\s*manga$/i, ''),               // title
            Date.now() 
        );

        return true;
    }
}

export default Parser;
