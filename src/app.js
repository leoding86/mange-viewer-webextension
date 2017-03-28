import Vue from 'vue'
import App from './App.vue'
import config from './modules/config';

/* Create a mount point */
let $appContainer = document.createElement('div');
$appContainer.id = 'cvr-app-container';
$appContainer.style.position = 'fixed';
$appContainer.style.top = '0';
$appContainer.style.left = '0';
document.querySelector('body').appendChild($appContainer);

/* load config from storage */
config.get(null).then((config) => {
    window._cvrContainer.config = config;

    new Vue({
      el: '#cvr-app-container',
      render: h => h(App)
    })
});
