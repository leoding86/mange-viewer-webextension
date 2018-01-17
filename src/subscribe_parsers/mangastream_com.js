import * as Common from '../modules/common';
import _ from '../modules/_';
import XHR from '../modules/XHR';
import BaseParser from './BaseParser';

class Parser extends BaseParser {

    constructor () {
        super('mangastream_com');

        return new Promise((resolve, reject) => {
            resolve(this);
        });
    }

    getMangaURL () {
        return [this.site, 'manga', this.id].join('/');
    }

    getChapterURL (chapterId) {
        if (!this.id)
            throw('Need id to get chapter URL');

        return ['http://readms.net/r', this.id, chapterId, 1].join('/');
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

                this.parseDocument(xhr.responseText);
                resolve(this.toJSON());
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

                this.parseDocument(xhr.responseText);
                this.lastestSavedChapterId = this.lastestChapterId;
                super.saveSubscribe(resolve, reject);
            };
            xhr.send(null);
        });
    }

    parseDocument (document) {
        let doc = super.parseDocument(document);
        let lastestChapterEl = doc.querySelector('table a');
        let lastestChapterId = /(\d+\/\d+)\/1?$/.exec(lastestChapterEl.getAttribute('href'))[1];
        let lastestChapterTitle = lastestChapterEl.textContent;
        let title = doc.querySelector('h1').textContent;
        let lastTime = Date.now();

        this.setSubscribeInfoProperties(lastestChapterId, lastestChapterTitle, title, lastTime);

        return true;
    }
}

export default Parser;
