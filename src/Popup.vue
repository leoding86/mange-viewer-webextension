<template>
    <div class="popup-content">
        <div v-if="!showInfo">
            <p class="not-supported">{{not_supported}}</p>
        </div>
        <div v-if="showInfo" class="site-info">
            <div class="site"><img :src="logo" :alt="site"></div>
            <div class="button" @click="startReadClickHandle">{{startRead}}</div>
        </div>
    </div>
</template>

<script>
    import _ from './modules/_';
    import { UrlBuilder } from './modules/common';

    export default {
        name: 'popup',

        data () {
            return {
                showInfo: false,
                startRead: _('start_read'),
                site: "unkown site",
                logo: null,
                parser: null,
                requestUrl: null
            }
        },

        computed: {
            not_supported () {
                return _('not_supported');
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
                    console.log(response);
                    if (response) {
                        _this.showInfo = true;
                        _this.site = response.data.site;
                        _this.logo = response.data.logo;
                        _this.requestUrl = response.data.url;
                        _this.parser = response.data.parser;
                    }
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

<style lang="sass">
    body {
        background: #101010;
    }

    .popup-content {
        width: 200px;

        .not-supported {
            color: #fff;
            text-align: center;
            font-size: 14px;
        }

        .site-info {
            img {
                width: 200px;
            }

            .button {
                padding: 5px 0;
                text-align: center;
                background: #008fd4;
                border: 1px solid #1ba7ec;
                color: #f1faff;
                font-size: 14px;
                cursor: pointer;
            }

            .button:hover {
                box-shadow: 0 0px 8px #9cdcfb
            }
        }
    }
</style>