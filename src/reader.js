import Vue from 'vue'
import Reader from './Reader.vue'
import config from './modules/config';

window._cvrContainer = {};

/* load config from storage */
config.get(null).then((config) => {
    window._cvrContainer.config = config;

    new Vue({
      el: '#app',
      render: h => h(Reader)
    })
});
