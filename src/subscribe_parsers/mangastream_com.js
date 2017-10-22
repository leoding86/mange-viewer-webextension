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
            xhr.onload = () => {
                let domparser = new DOMParser();
                let elements = domparser.parseFromString(xhr.responseText, 'text/html');
                let lastestChapterEl = elements.querySelector('table a');
                this.lastestChapterId = /(\d+\/\d+)\/1?$/.exec(lastestChapterEl.getAttribute('href'))[1];
                this.lastestChapterTitle = lastestChapterEl.textContent;
                this.title = elements.querySelector('h1').textContent;

                this.lastTime = Date.now();

                resolve(this.toJSON());
            };
            xhr.send(null);
        });
    }

    saveSubscribe () {
        return new Promise((resolve, reject) => {
            let xhr = XHR();
            xhr.open('get', this.getMangaURL());
            xhr.onload = () => {
                let domparser = new DOMParser();
                let elements = domparser.parseFromString(xhr.responseText, 'text/html');
                let lastestChapterEl = elements.querySelector('table a');
                this.lastestSavedChapterId = this.lastestChapterId = /(\d+\/\d+)\/1?$/.exec(lastestChapterEl.getAttribute('href'))[1];
                this.lastestChapterTitle = lastestChapterEl.textContent;
                this.title = elements.querySelector('h1').textContent;
                this.lastTime = Date.now();

                super.saveSubscribe(resolve, reject);
            };
            xhr.send(null);
        });
    }
}

export default Parser;
