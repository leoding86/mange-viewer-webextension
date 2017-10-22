import { _ua, _r } from '../modules/common';
import _ from '../modules/_';
import storage from '../modules/storage';
import md5 from 'md5';

class BaseParser {

    constructor (name) {
        this.name = name;
        this.pattern = _r[name].mhpattern;
        this.groups = _r[name].mhgroups;
        this.site = _r[name].site;
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
     * Get subscribe id with specified manga
     * @return {String}
     */
    getSubscribeId () {
        return md5(this.name + this.id);
    }

    /**
     * Get current manga url
     * @return {[type]} [description]
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
        let subKey = 'subInfo_' + this.subscribeId;

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

}

export default BaseParser;
