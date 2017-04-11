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
        return ['//kissmanga.com/Manga', this.id].join('/');
    }

    sync () {
        return new Promise((resolve, reject) => {
            resolve(this);
        });
    }

    saveSubscribe () {
        return new Promise((resolve, reject) => {
            let xhr = XHR();
            xhr.open('get', this.getMangaURL());
            xhr.onload = () => {
                let domparser = new DOMParser();
                let elements = domparser.parseFromString(xhr.responseText, 'text/html');
                let lastestChapterEl = elements.querySelector('.listing a');
                this.lastestSavedChapterId = this.lastestChapterId = /id=(\d+)/.exec(lastestChapterEl.href)[1];
                this.lastestSavedChapterTitle = this.lastestChapterTitle = lastestChapterEl.innerText;
                this.title = elements.querySelector('.bigChar').innerText;
                this.lastTime = Date.now();
                this.extras.chapterStr = /([^\/]+)\?id/.exec(lastestChapterEl.href)[1];;

                super.saveSubscribe(resolve, reject);
            };
            xhr.send(null);
        });
    }
}

export default Parser;
