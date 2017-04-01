import Vue from 'vue';
import VueRouter from 'vue-router';
import config from './modules/config';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/bootstrap.css';
import _ from './modules/_';

Vue.use(VueRouter);

const History = require('./History.vue');
const Subscribe = require('./Subscribe.vue');
const Other = require('./Other.vue');

const routes = [
    { path: '/', component: History },
    { path: '/history', component: History },
    { path: '/subscribe', component: Subscribe },
    { path: '/other', component: Other }
];

const router = new VueRouter({
    routes
});

window._cvrContainer = {};
config.get(null).then((cfg) => {
    window._cvrContainer.config = cfg;

    const app = new Vue({
        router: router,

        mounted () {
            this.$el.style.display = 'block';
        },

        methods: {
            openReaderHandler () {
                chrome.tabs.create({
                    url: chrome.runtime.getURL('pages/reader.html')
                });
            },

            _ (string) {
                return _(string);
            }
        }
    }).$mount('#app');
});