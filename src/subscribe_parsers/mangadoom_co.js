import * as Common from '../modules/common';
import _ from '../modules/_';
import XHR from '../modules/XHR';
import BaseParser from './BaseParser';
import underscore from 'underscore';

class Parser extends BaseParser {

    constructor () {
        super('mangadoom_co');

        return new Promise((resolve, reject) => {
            resolve(this);
        });
    }

    getMangaURL () {
        return 'http:' + [this.site, this.id].join('/');
    }

    getChapterURL (chapterId) {
        return 'http:' + [this.site, this.id, chapterId, 1].join('/');
    }

    sync () {
        return new Promise((resolve, reject) => {
            let xhr = XHR();
            xhr.open('get', this.getMangaURL());
            xhr.onload = () => {
                let domparser = new DOMParser();
                let elements = domparser.parseFromString(xhr.responseText, 'text/html');
                let chapterInfo = this.getLastestChatperInfo(elements);

                this.lastestChapterId = chapterInfo.id;
                this.lastestChapterTitle = chapterInfo.title;
                this.title = elements.querySelector('.widget-heading').innerText;
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
                let chapterInfo = this.getLastestChatperInfo(elements);

                this.lastestSavedChapterId = this.lastestChapterId = chapterInfo.id;
                this.lastestSavedChapterTitle = this.lastestChapterTitle = chapterInfo.title;
                this.title = elements.querySelector('.widget-heading').innerText;
                this.lastTime = Date.now();

                super.saveSubscribe(resolve, reject);
            };
            xhr.send(null);
        });
    }

    getLastestChatperInfo (responseDom) {
        let chaptersEls = responseDom.querySelectorAll('.chapter-list li');
        let chapters = [];
        chaptersEls.forEach((chapterEl) => {
            let datestr = chapterEl.querySelector('.date').textContent.trim();
            let title = chapterEl.querySelector('.val').textContent.trim();
            let chapterNo = /\d+(?:\.\d+)?$/.exec(title)[0] - 0;

            let matches = /(\d+)\s*(years|year|month|months|weeks|week|days|day|hours|hour|minutes|minute|seconds|second)/i.exec(datestr);
            let i = -100;
            let unit = matches[2].toLowerCase();

            if (matches) {
                let base = matches[1].length < 10000 ? 10000 + matches[1] : matches[1];

                switch (unit) {
                    case 'years':
                    case 'year':
                        i = 7 + '' + base; break;
                    case 'month':
                    case 'months':
                        i = 6 + '' + base; break;
                    case 'weeks':
                    case 'week':
                        i = 5 + '' + base; break;
                    case 'days':
                    case 'day':
                        i = 4 + '' + base; break;
                    case 'hours':
                    case 'hour':
                        i = 3 + '' + base; break;
                    case 'minutes':
                    case 'minute':
                        i = 2 + '' + base; break;
                    case 'seconds':
                    case 'second':
                        i = 1 + '' + base; break;
                }
            }

            chapters.push({ i: i, id: chapterNo, title: title});
        });

        return chapters.shift();
    }
}

export default Parser;
