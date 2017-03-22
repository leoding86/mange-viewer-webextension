import Vue from 'vue'
import App from './Popup.vue'
import Config from './modules/Config';

_cvrContainer = window._cvrContainer = {}

/* load config from storage */
Config.get(null).then((config) => {
    _cvrContainer.config = config;

    new Vue({
      el: '#app',
      render: h => h(App)
    })
});
