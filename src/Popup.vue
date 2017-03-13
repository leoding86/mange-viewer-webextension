<template>
    <div class="row">
        <div v-if="showInfo" class="col-md-12">
            <div class="site">{{site}}</div>
            <button class="btn btn-default"
                    @click="startReadClickHandle">{{startRead}}</button>
        </div>
    </div>
</template>

<script>
    import 'bootstrap/dist/css/bootstrap.css';
    import _ from './modules/_';
    import { UrlBuilder } from './modules/common';

    export default {
        name: 'popup',

        data () {
            return {
                showInfo: true,
                startRead: _('start_read'),
                site: "unkown site",
                parser: null,
                requestUrl: null
            }
        },

        beforeCreate () {
            let _this = this;
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.runtime.sendMessage({
                    from: "popup",
                    data: {
                        op: "needData",
                        tabId: tabs[0].id
                    }
                }, (response) => {
                    _this.site = response.data.site;
                    _this.requestUrl = response.data.url;
                    _this.parser = response.data.parser;
                })
            });
        },

        mounted () {
        },

        methods: {
            startReadClickHandle () {
                if (this.requestUrl) {
                    let url = new UrlBuilder(
                        chrome.extension.getURL('./pages/comic_viewer.html')
                    );
                    url.setParams({
                        url  : this.requestUrl,
                        name : this.parser
                    });
                    chrome.tabs.create({ url: url.toString() });
                }
            }
        }
    }
</script>

<style></style>