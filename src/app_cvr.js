import Vue from 'vue'
import App from './App.vue'
import Config from './modules/Config';

/* Create a mount point */
let $appContainer = document.createElement('div');
$appContainer.id = 'cvr-app-container';
$appContainer.style.position = 'fixed';
$appContainer.style.top = '0';
$appContainer.style.left = '0';
document.querySelector('body').appendChild($appContainer);

let _cvrContainer = window._cvrContainer = {}

/* load config from storage */
Config.get(null).then((config) => {
    _cvrContainer.config = config;

    new Vue({
      el: '#cvr-app-container',
      render: h => h(App)
    })
});
