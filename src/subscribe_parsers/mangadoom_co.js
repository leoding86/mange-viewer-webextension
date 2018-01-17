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
        return [this.site, this.id].join('/');
    }

    getChapterURL (chapterId) {
        return [this.site, this.id, chapterId, 1].join('/');
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

    getLastestChatperInfo (responseDom) {
        let chaptersEls = responseDom.querySelectorAll('.chapter-list li');
        let chapters = [];
        let chapter = {};
        chaptersEls.forEach((chapterEl) => {
            let datestr = chapterEl.querySelector('.date').textContent.trim();
            let title = chapterEl.querySelector('.val').textContent.trim();
            let chapterNo = /\d+(?:\.\d+)?$/.exec(title)[0] - 0;

            let matches = /(\d+)\s*(years|year|month|months|weeks|week|days|day|hours|hour|minutes|minute|seconds|second)/i.exec(datestr);
            let times = matches[1];
            let unit = matches[2].toLowerCase();
            let weight = Number.MAX_SAFE_INTEGER;

            if (matches) {
                switch (unit) {
                    case 'years':
                    case 'year':
                        weight = times * 31536000; break;
                    case 'month':
                    case 'months':
                        weight = times * 2592000; break;
                    case 'weeks':
                    case 'week':
                        weight = times * 604800; break;
                    case 'days':
                    case 'day':
                        weight = times * 86400; break;
                    case 'hours':
                    case 'hour':
                        weight = times * 3600; break;
                    case 'minutes':
                    case 'minute':
                        weight = times * 60; break;
                    case 'seconds':
                    case 'second':
                        weight = times; break;
                }

                if (!chapter.weight || weight < chapter.weight) {
                    chapter.id = chapterNo;
                    chapter.title = title;
                    chapter.weight = weight;
                }
            }
        });

        return chapter;
    }

    parseDocument (document) {
        let dom = super.parseDocument(document);
        let chapterInfo = this.getLastestChatperInfo(dom);
        let lastestChapterId = chapterInfo.id;
        let lastestChapterTitle = chapterInfo.title;
        let title = dom.querySelector('.widget-heading').innerText;
        let lastTime = Date.now();

        this.setSubscribeInfoProperties(lastestChapterId, lastestChapterTitle, title, lastTime);

        return true;
    }
}

export default Parser;
