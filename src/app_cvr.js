import Vue from 'vue'
import App from './App.vue'

/* Create a mount point */
let $appContainer = document.createElement('div');
$appContainer.id = 'cvr-app-container';
$appContainer.style.position = 'fixed';
$appContainer.style.top = '0';
$appContainer.style.left = '0';
$appContainer.innerText = '123';
document.querySelector('body').appendChild($appContainer);

let _cvrBus = window._cvrBus = new Vue();

new Vue({
  el: '#cvr-app-container',
  render: h => h(App)
})
