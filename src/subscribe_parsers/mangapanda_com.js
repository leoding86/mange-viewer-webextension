import * as Common from '../modules/common';
import _ from '../modules/_';
import XHR from '../modules/XHR';
import BaseParser from './BaseParser';

class Parser extends BaseParser {

    constructor () {
        super('mangapanda_com');

        return new Promise((resolve, reject) => {
            resolve(this);
        });
    }

    getMangaURL () {
        return [this.site, this.id].join('/');
    }

    getChapterURL (chapterId) {
        if (!this.id)
            throw('Need id to get chapter URL');

        return [this.site, this.id, chapterId].join('/');
    }

    sync () {
        return new Promise((resolve, reject) => {
            let xhr = XHR();
            xhr.open('get', this.getMangaURL());
            xhr.onload = () => {
                let domparser = new DOMParser();
                let elements = domparser.parseFromString(xhr.responseText, 'text/html');
                let lastestChapterEl = elements.querySelector('#latestchapters li');
                this.lastestChapterId = /(\d+)\/?$/.exec(lastestChapterEl.querySelector('a').getAttribute('href'))[1];
                this.lastestChapterTitle = lastestChapterEl.querySelector('a').textContent;
                this.title = elements.querySelector('#mangaproperties h1').textContent.replace('manga', '');
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
                let lastestChapterEl = elements.querySelector('#latestchapters li');
                this.lastestSavedChapterId = this.lastestChapterId = /(\d+)\/?$/.exec(lastestChapterEl.querySelector('a').getAttribute('href'))[1];
                this.lastestChapterTitle = lastestChapterEl.querySelector('a').textContent;
                this.title = elements.querySelector('#mangaproperties h1').textContent;
                this.lastTime = Date.now();
                super.saveSubscribe(resolve, reject);
            };
            xhr.send(null);
        });
    }
}

export default Parser;
