import * as Common from '../modules/common';
import _ from '../modules/_';
import XHR from '../modules/XHR';
import BaseParser from './BaseParser';

class Parser extends BaseParser {

    constructor () {
        super('kissmanga_com');

        return new Promise((resolve, reject) => {
            resolve(this);
        });
    }

    getMangaURL () {
        return [this.site, 'Manga', this.id].join('/');
    }

    getChapterURL () {
        return [this.site, this.extras.chapterUrl].join('');
    }

    sync () {
        return new Promise((resolve, reject) => {
            let xhr = XHR();
            xhr.open('get', this.getMangaURL());
            xhr.onload = () => {
                if (this.parseDocument(xhr.responseText)) {
                    resolve(this.toJSON());
                }
            };
            xhr.onerror = () => {
                reject();
            };
            xhr.send(null);
        });
    }

    saveSubscribe () {
        return new Promise((resolve, reject) => {
            let xhr = XHR();
            xhr.open('get', this.getMangaURL());
            xhr.onload = () => {
                if (this.parseDocument(xhr.responseText)) {
                    this.lastestSavedChapterId = this.lastestChapterId;
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

    parseDocument (document, done) {
        let dom = super.parseDocument(document);
        let lastestChapterEl = dom.querySelector('.listing a');

        this.setSubscribeInfoProperties(
            /id=(\d+)/.exec(lastestChapterEl.getAttribute('href'))[1],
            lastestChapterEl.innerText,
            dom.querySelector('.bigChar').innerText,
            Date.now(),
            {
                chapterStr: /([^\/]+)\?id/.exec(lastestChapterEl.getAttribute('href'))[1],
                chapterUrl: lastestChapterEl.getAttribute('href')
            }
        );

        return true;
    }
}

export default Parser;
