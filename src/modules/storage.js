import bowser from 'bowser';

let storage = {
    SYNC_QUOTA_BYTES () {
        if (this.hasSyncSupport()) {
            return chrome.storage.sync.QUOTA_BYTES;
        } else {
            return 0;
        }
    },

    QUOTA_BYTES_PER_ITEM () {
        if (this.hasSyncSupport()) {
            return chrome.storage.sync.QUOTA_BYTES_PER_ITEM;
        } else {
            return 0;
        }
    },

    LOCAL_QUOTA_BYTES: chrome.storage.local.QUOTA_BYTES,

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

    getBytesInUse (params, callback) {
        if (this.hasSyncSupport()) {
            chrome.storage.sync.getBytesInUse(params, callback);
        } else {
            this.getBytesInUseLocal(params, callback);
        }
    },

    clear (callback) {
        if (this.hasSyncSupport()) {
            chrome.storage.sync.clear(callback);
        }
    },

    getLocal (key, callback) {
        chrome.storage.local.get(key, callback);
    },

    setLocal (object, callback) {
        chrome.storage.local.set(object, callback);
    },

    getBytesInUseLocal (params, callback) {
        chrome.storage.local.getBytesInUse(params, callback);
    },

    clearLocal (callback) {
        chrome.storage.local.clear(callback);
    },

    hasGetBytesInUseSyncSupport () {
        return chrome.storage.sync.getBytesInUse ? true : false;
    },

    hasGetBytesInUseLocalSupport () {
        return chrome.storage.local.getBytesInUse ? true : false;
    }
}

export default storage;