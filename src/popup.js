import Vue from 'vue'
import App from './Popup.vue'
import config from './modules/config';

_cvrContainer = window._cvrContainer = {}

/* load config from storage */
config.get(null).then((config) => {
    _cvrContainer.config = config;

    new Vue({
      el: '#app',
      render: h => h(App)
    })
});
