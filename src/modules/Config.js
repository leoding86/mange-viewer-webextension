let Config = {
    set (key, value) {
        chrome.storage.sync.get('config', (items) => {
            if (!items.config) {
                items.config = {};
            }
            items.config[key] = value;
            chrome.storage.sync.set({'config': items.config});
        });
    },

    get (key) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get('config', (items) => {
                if (key === null) {
                    resolve(items.config ? items.config : null);
                } else {
                    resolve((items.config && items.config[key] !== undefined) ? items.config[key] : null);
                }
            });
        })
    },

    change (listener) {
        chrome.storage.onChanged.addListener((changes, namespace) => {
            listener(changes, namespace);
        });
    }
};

export default Config;