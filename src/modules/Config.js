import Debug from '../components/CvrDebugEvent';

let Config = {
    set (key, value) {
Debug.emit('Set config \'' + key + '\' to ' + value);
        chrome.storage.sync.get('config', (items) => {
            if (!items.config) {
                items.config = {};
            }
            items.config[key] = value;
            chrome.storage.sync.set({'config': items.config}, () => {
                if (chrome.runtime.lastError !== undefined) {
Debug.emit('Config has been saved');
                } else {
Debug.emit('Save config failed. ' + chrome.runtime.lastError);
                }
            });
        });
    },

    get (key) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get('config', (items) => {
                if (!items.config) {
                    items.config = this._config;
                } else {
                    for (let name in this._config) {
                        if (!items.config[name]) {
                            items.config[name] = this._config;
                        }
                    }
                }

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
    },

    _config: {
        'debug_mode'     : 0,
        'init_zoom_level': 1
    }
};

export default Config;