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
        this.lastestReadedChapterId = null;
        this.lastestReadedChapterTitle = null;
        this.lastestSavedChapterId = null;
        this.lastestSavedChapterTitle = null;
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

    /**
     * Save manga to subscribe area
     * @return {void}
     */
    saveSubscribe (resolve, reject) {
        let data = this.toJSON();
        let subKey = 'subInfo_' + this.subscribeId;

        storage.get(['subscribes', subKey], (items) => {
            /* Check has the manga been subscribed */
            if (items.subscribes && items.subscribes[this.subscribeId]) {
                resolve(_('has_been_subscribed'));
            } else {
                if (!items.subscribes) items.subscribes = {};

                items.subscribes[this.subscribeId] = {
                    name: this.parserName,
                    id: this.subscribeId
                };

                items[subKey] = this.toJSON();

                storage.set(items, () => {
                    if (chrome.runtime.lastError) {
                        reject(_('subscribe_failed') + chrome.runtime.lastError);
                    } else {
                        resolve(_('subscribe_successed'));
                    }
                });
            }
        });
    }

    toJSON () {
        return {
            'subscribeId': this.subscribeId,
            'lastestSavedChapterId': this.lastestSavedChapterId,
            'lastestSavedChapterTitle': this.lastestSavedChapterTitle,
            'lastestChapterId': this.lastestChapterId,
            'lastestChapterTitle': this.lastestChapterTitle,
            'lastestReadedChapterId': this.lastestReadedChapterId,
            'lastestReadedChapterTitle': this.lastestReadedChapterTitle,
            'title': this.title,
            'lastTime': this.lastTime,
            'parserName': this.parserName,
            'extras': this.extras
        }
    }

}

export default BaseParser;
