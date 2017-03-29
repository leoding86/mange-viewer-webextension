import Vue from 'vue';
import VueRouter from 'vue-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/bootstrap.css';

Vue.use(VueRouter);

const History = require('./History.vue');
const Other = require('./Other.vue');

const routes = [
    { path: '/', component: History },
    { path: '/history', component: History },
    { path: '/other', component: Other }
];

const router = new VueRouter({
    routes
});

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
        }
    }
}).$mount('#app');