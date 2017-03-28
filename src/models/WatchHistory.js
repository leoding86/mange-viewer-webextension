import storage from '../modules/storage';
import md5 from 'md5';

class WatchHistory {

    constructor (id, icon, link, title, volume, chapter) {
        this.id = md5(id);
        this.icon = icon;
        this.link = link;
        this.title = title;
        this.volume = volume;
        this.chapter = chapter;
        this.page = 1;
        this.lastVisited = Date.now();


    }

    save (page) {
        this.page = page;
        this.lastVisited = Date.now();

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

            storage.set(items, () => {
                if (chrome.runtime.lastError) {
                    console.log('histories are not saved');
                } else {
                    console.log('histories are saved');
                }
            });
        });
    }

    toJSON () {
        return {
            'id'         : this.id,
            'icon'       : this.icon,
            'link'       : this.link,
            'title'      : this.title,
            'volume'     : this.volume,
            'chapter'    : this.chapter,
            'page'       : this.page,
            'lastVisited': this.lastVisited
        }
    }

}

export default WatchHistory;