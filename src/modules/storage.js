import bowser from 'bowser';

let storage = {
    hasSyncSupport () {
        if (
            bowser.firefox && bowser.version <= 53 ||
            bowser.msedge ||
            bowser.opera
        ) {
            return false;
        } else {
            return true;
        }
    },

    get (key, callback) {
        if (this.hasSyncSupport()) {
            chrome.storage.sync.get(key, callback);
        } else {
            chrome.storage.local.get(key, callback);
        }
    },

    set (object, callback) {
        if (this.hasSyncSupport()) {
            chrome.storage.sync.set(object, callback);
        } else {
            chrome.storage.local.set(object, callback);
        }
    },

    getLocal (key, callback) {
        chrome.storage.local.get(key, callback);
    },

    setLocal (object, callback) {
        chrome.storage.local.set(object, callback);
    }
}

export default storage;