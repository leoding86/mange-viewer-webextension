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

    sync () {
        return new Promise((resolve, reject) => {
            let xhr = XHR();
            xhr.open('get', this.getMangaURL());
            xhr.onload = () => {
                let domparser = new DOMParser();
                let elements = domparser.parseFromString(xhr.responseText, 'text/html');
                let streamEls = elements.querySelectorAll('.stream');
                let streamEl = streamEls[streamEls.length - 1];
                let lastestChapterEls = streamEl.querySelectorAll('.chapter');
                let lastestChapterEl = lastestChapterEls[0].querySelector('a');
                this.lastestChapterId = /(s\d+\/(?:.+\/)*c\d+(?:\.\d+)?)\/1?$/.exec(lastestChapterEl.getAttribute('href'))[1];
                this.lastestChapterTitle = lastestChapterEl.textContent.trim();
                this.title = elements.querySelector('.hd h1').textContent.trim().replace(/\s*manga$/i, '');
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
                let streamEls = elements.querySelectorAll('.stream');
                let streamEl = streamEls[streamEls.length - 1];
                let lastestChapterEls = streamEl.querySelectorAll('.chapter');
                let lastestChapterEl = lastestChapterEls[0].querySelector('a');
                this.lastestSavedChapterId = this.lastestChapterId = /(s\d+\/(?:.+\/)*c\d+(?:\.\d+)?)\/1?$/.exec(lastestChapterEl.getAttribute('href'))[1];
                this.lastestSavedChapterTitle = this.lastestChapterTitle = lastestChapterEl.textContent.trim();
                this.title = elements.querySelector('.hd h1').textContent.trim().replace(/\s*manga$/i, '');
                this.lastTime = Date.now();

                super.saveSubscribe(resolve, reject)
            };
            xhr.send(null);
        });
    }
}

export default Parser;
