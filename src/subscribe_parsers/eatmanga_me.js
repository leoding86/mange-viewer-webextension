import * as Common from '../modules/common';
import _ from '../modules/_';
import XHR from '../modules/XHR';
import BaseParser from './BaseParser';

class Parser extends BaseParser {

    constructor () {
        super('eatmanga_me');

        return new Promise((resolve, reject) => {
            resolve(this);
        });
    }

    getMangaURL () {
        return [this.site, 'Manga-Scan', this.id].join('/');
    }

    getChapterURL (chapterId) {
        return [this.site, 'Manga-Scan', this.id, chapterId].join('/');
    }

    sync () {
        return new Promise((resolve, reject) => {
            let xhr = XHR();
            xhr.open('get', this.getMangaURL());
            xhr.onload = () => {
                let domparser = new DOMParser();
                let elements = domparser.parseFromString(xhr.responseText, 'text/html');
                let lastestChapterEl = elements.querySelector('#updates li').nextSibling.querySelector('a');
                this.lastestChapterId = /([^\/]+)\/?$/.exec(lastestChapterEl.getAttribute('href'))[1];
                this.lastestChapterTitle = lastestChapterEl.textContent;
                this.title = elements.querySelector('p b').textContent.replace(' manga', '');
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
                let lastestChapterEl = elements.querySelector('#updates li').nextSibling.querySelector('a');
                this.lastestSavedChapterId = this.lastestChapterId = /([^\/]+)\/?$/.exec(lastestChapterEl.getAttribute('href'))[1];
                this.lastestChapterTitle = lastestChapterEl.textContent;
                this.title = elements.querySelector('p b').textContent.replace(' manga', '');
                this.lastTime = Date.now();

                super.saveSubscribe(resolve, reject)
            };
            xhr.send(null);
        });
    }
}

export default Parser;
