import { _ua, _r } from '../modules/common';
import _ from '../modules/_';
import storage from '../modules/storage';
import md5 from 'md5';

class BaseParser {

    constructor (name) {
        this.name = name;
        this.pattern = _r[name].mhpattern;
        this.groups = _r[name].mhgroups;
        this.site = this._getSiteHotfix(_r[name].site);
        this.url = null;
        this.id = null;
        this.subscribeId = null;
        this.lastestChapterId = null;
        this.lastestChapterTitle = null;
        this.lastestSavedChapterId = null;
        this.parserName = name;
        this.extras = {};
    }

    init (url) {
        this.url = url;
        let matches = this.pattern.exec(this.url);
        this.id = matches[this.groups.id];
        this.subscribeId = this.getSubscribeId();
    }

    /**
     * hotfix
     * 
     * Get site with currently protocol http or https
     */
    _getSiteHotfix (site) {
        if (window.location.protocol === 'https:' &&
            /^http:/.test(site)
        ) {
            return site.replace(/^http:/, 'https:');
        }
        return site;
    }

    /**
     * Get subscribe id with specified manga
     * @return {String}
     */
    getSubscribeId () {
        return md5(this.name + this.id);
    }

    /**
     * Get subscribe key for store subscribe info
     * 
     * @return {String}
     */
    getSubscribeKey () {
        return 'subInfo_' + this.subscribeId;
    }

    /**
     * Get current manga url
     * @return {string} [description]
     */
    getMangaURL () { }

    /**
     * Get manga url with specified chapter;
     * @return {String}
     */
    getChapterURL () { }

    sync () { }

    /**
     * Save manga to subscribe area
     * @return {void}
     */
    saveSubscribe (resolve, reject) {
        let data = this.toJSON();
        let subKey = this.getSubscribeKey();

        storage.get([subKey], (items) => {
            /* Check has the manga been subscribed */
            if (items[subKey]) {
                resolve(_('has_been_subscribed'));
            }

            items[subKey] = this.toJSON();

            storage.set(items, () => {
                if (chrome.runtime.lastError) {
                    reject(_('subscribe_failed') + chrome.runtime.lastError);
                } else {
                    resolve(_('subscribe_successed'));
                }
            });
        });
    }

    toJSON () {
        return {
            'subscribeId': this.subscribeId ? this.subscribeId : this.getSubscribeId(),
            'mangaId': this.id,
            'lastestSavedChapterId': this.lastestSavedChapterId,
            'lastestChapterId': this.lastestChapterId,
            'lastestChapterTitle': this.lastestChapterTitle,
            'title': this.title,
            'lastTime': this.lastTime,
            'parserName': this.parserName,
            'extras': this.extras
        }
    }

    isSubscribed () {
        if (!this.parseDocument(window.document)) { // parseDocument method is from child class
            return null;
        }

        if (window._cvrContainer && window._cvrContainer.appDataEntries) {
            let subscribeKey = this.getSubscribeKey();
            return Boolean(window._cvrContainer.appDataEntries[subscribeKey]);
        }

        return false;
    }

    /**
     * @param  {string|Document} document
     * @return {Document}
     */
    parseDocument (document) {
        let dom;

        if (typeof document === 'string') {
            let domParser = new DOMParser();
            dom = domParser.parseFromString(document, 'text/html');
        } else if (typeof document === 'object' && document.nodeType && document.nodeType === Node.DOCUMENT_NODE) {
            dom = document;
        }

        return dom;
    }

    /**
     * Apply properties about subscribe information
     * 
     * @param {String} chapterId 
     * @param {String} chapterTitle 
     * @param {String} title 
     * @param {String} lastTime 
     * @param {String} extras 
     * @memberof BaseParser
     */
    setSubscribeInfoProperties (chapterId, chapterTitle, title, lastTime, extras) {
        this.lastestChapterId = chapterId;
        this.lastestChapterTitle = chapterTitle;
        this.title = title;
        this.lastTime = lastTime;
        this.extras = extras;
    }

    /**
     * @param  {string} error
     */
    throwError (error) {
        let errorMsg = !error ? 'Cannot parse document' : error;
        throw errorMsg;
    }
}

export default BaseParser;
