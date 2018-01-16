import Vue from 'vue'
import SubscribeDetector from './SubscribeDetector.vue'
import storage from './modules/storage';

storage.get(null, (entries) => {
    window._cvrContainer.appDataEntries = entries;
    let p = require('./subscribe_parsers/' + window._cvrContainer.parser + '.js');

    (new p.default()).then((instance) => {
        window._cvrContainer.parserInstance = instance; // store parse in window scope
        
        /* Create a mount point */
        let $appContainer = document.createElement('div');
        $appContainer.id = 'cvr-app-container';
        $appContainer.style.position = 'fixed';
        $appContainer.style.top = '0';
        $appContainer.style.left = '0';
        document.querySelector('body').appendChild($appContainer);

        new Vue({
            el: '#cvr-app-container',
            render: h => h(SubscribeDetector)
        })
    });
});