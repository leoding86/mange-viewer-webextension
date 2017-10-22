import storage from '../modules/storage';
import Debug from 'components/CvrDebugEvent';
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
                        items[k].lastTime = subObjs[k].lastTime;
                        items[k].extras = subObjs[k].extras;
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
                    storage.set(items, () => {
                        resolve(id);
                    });
                }
            });
        });
    }

    check () {
Debug.emit('Check subscribes');
        this.init().then(() => {
            let mangaUpdateCounter = 0;

            for (let i in this.subscribes) {
                if (this.subscribes[i].lastestChapterId !== this.subscribes[i].lastestSavedChapterId) {
                    mangaUpdateCounter++;
                }
            }

            chrome.browserAction.setBadgeText({ text: mangaUpdateCounter + '' });
        });
    }

}

export default Subscribe;