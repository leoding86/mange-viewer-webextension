import storage from '../modules/storage';
import md5 from 'md5';

class WatchHistory {

    constructor (id, icon, link, title) {
        this.rawId = id;
        this.id = md5(id);
        this.icon = icon;
        this.link = link;
        this.title = title;
        this.page = 1;
        this.lastVisited = Date.now();
    }

    save (page, link = null) {
        if (!this.rawId.trim()) {
            return;
        } 

        this.page = page;
        this.link = link ? link : this.link; 
        this.lastVisited = Date.now();

        this.saveLocal(page, link);
        this.saveSync(page, link);
    }

    saveLocal (page, link) {
        storage.getLocal('histories', (items) => {
            /* check manga is recorded, if do, remove it from histories */
            if (items && items.histories) {
                for (let i = 0, l = items.histories.length; i < l; i++) {
                    let history = items.histories[i];
                    if (history.id && history.id == this.id) {
                        let index = items.histories.indexOf(history);
                        items.histories.splice(index, 1);
                        break;
                    }
                }
            } else {
                items.histories = [];
            }

            /** reached limitation **/
            while (items.histories.length > 1000) {
                items.histories.splice(-1, 1);
            }

            let record = this.toJSON();
            items.histories.unshift(record);

            storage.setLocal(items, () => {
                if (chrome.runtime.lastError) {
                    console.log('histories are not saved');
                } else {
                    console.log('histories are saved');
                }
            });
        });
    }

    saveSync (page, link) {
        storage.get('histories', (items) => {
            /* check manga is recorded, if do, remove it from histories */
            if (items && items.histories) {
                for (let i = 0, l = items.histories.length; i < l; i++) {
                    let history = items.histories[i];
                    if (history.id && history.id == this.id) {
                        let index = items.histories.indexOf(history);
                        items.histories.splice(index, 1);
                        break;
                    }
                }
            } else {
                items.histories = [];
            }

            let record = this.toJSON();
            items.histories.unshift(record);

            /** reached limitation **/
            storage.getBytesInUse('histories', (bytes) => {
                if (Math.round(bytes / storage.QUOTA_BYTES_PER_ITEM() * 100) > 95) {
                    items.histories.splice(-1, 1);
                }

                storage.set(items, () => {
                    if (chrome.runtime.lastError) {
                        console.log('histories are not saved');
                    } else {
                        console.log('histories are saved');
                    }
                });
            });
        });
    }

    toJSON () {
        return {
            'id'         : this.id,
            'icon'       : this.icon,
            'link'       : this.link,
            'title'      : this.title,
            'page'       : this.page,
            'lastVisited': this.lastVisited
        }
    }

}

export default WatchHistory;