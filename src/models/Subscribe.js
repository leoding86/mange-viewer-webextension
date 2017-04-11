import storage from '../modules/storage';
import md5 from 'md5';

class Subscribe {
    
    constructor () {
        this.subscribes = [];
    }

    init () {
        return new Promise((resolve, reject) => {
            this.subscribes = [];
            storage.get(null, (entries) => {
                for (let k in entries) {
                    if (k.indexOf('subInfo_') === 0) {
                        this.subscribes.push(entries[k]);
                    }
                }
                resolve(this.subscribes);
            });
        });
    }

    update (subscribes) {
        return new Promise((resolve, reject) => {
            let subKeys = [];
            let subObjs = {};

            subscribes.forEach((item) => {
                let key = 'subInfo_' + item.subscribeId
                subKeys.push(key);
                subObjs[key] = item;
            });
            storage.get(subKeys, (items) => {

                for (let k in items) {
                    if (subObjs[k]) {
                        items[k].lastestChapterId = subObjs[k].lastestChapterId;
                        items[k].lastestChapterTitle = subObjs[k].lastestChapterTitle;
                        items[k].lastTime = subObjs[k].lastTime;
                    }
                }

                storage.set(items, () => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve('complete');
                    }
                });
            });
        });
    }

    remove (id) {
        return new Promise((resolve, reject) => {
            storage.remove('subInfo_' + id, () => {
                resolve(id);
            });
        });
    }

    clearNotice (id) {
        let key = 'subInfo_' + id;
        return new Promise((resolve, reject) => {
            storage.get(key, (items) => {
                if (items[key]) {
                    items[key].lastestSavedChapterId = items[key].lastestChapterId;
                    items[key].lastestSavedChapterTitle = items[key].lastestChapterTitle;
                    storage.set(items, () => {
                        resolve(id);
                    });
                }
            });
        });
    }

}

export default Subscribe;