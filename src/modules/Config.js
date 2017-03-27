import Debug from '../components/CvrDebugEvent';
import storage from '../modules/storage';

let config = {
    set (key, value) {
Debug.emit('Set config \'' + key + '\' to ' + value);
        storage.getLocal('config', (items) => {
            if (!items.config) {
                items.config = {};
            }
            items.config[key] = value;
            storage.setLocal({'config': items.config}, () => {
                if (chrome.runtime.lastError === undefined) {
Debug.emit('Config has been saved');
                } else {
Debug.emit('Save config failed. ' + chrome.runtime.lastError);
                }
            });
        });
    },

    get (key) {
        return new Promise((resolve, reject) => {
            storage.getLocal('config', (items) => {
                if (!items.config) {
                    items.config = this._config;
                } else {
                    for (let name in this._config) {
                        if (!this._checkConfigItem(name, items.config[name])) {
                            items.config[name] = this._config[name];
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
        'interactive_mode' : 1, // 1: mouse; 2: touchscreen
        'debug_mode'       : 0,
        'init_zoom_level'  : 1
    },

    _checkConfigItem (name, value) {
        if (name == 'debug_mode' && value && /^[01]$/.test(value)) {
            return true;
        } else if (name == 'init_zoom_level' && value && /^[123]$/.test(value)) {
            return true;
        } else if (name == 'interactive_mode' && value && /^[12]$/.test(value)) {
            return true;
        }

        return false;
    }
};

export default config;