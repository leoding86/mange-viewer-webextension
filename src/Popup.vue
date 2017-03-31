<template>
    <div id="popup-container" class="row">
        <div class="col-md-12">
            <switcher class="input-field-row"
                      :values="[1, 2]"
                      :configTitle="_('interactive_mode')"
                      v-model="interactiveModeValue"></switcher>
            <switcher class="input-field-row"
                      :values="[0, 1]"
                      :configTitle="_('debug_mode')"
                      v-model="debugModeValue"></switcher>
            <div class="row">
                <a href="#" @click="openMorePage" style="font-size:12px;">{{_('more')}}</a>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from './modules/_';
    import config from './modules/config';
    import { UrlBuilder } from './modules/common';

    export default {
        name : 'popup',

        components : {
            'switcher': require('./components/Switcher.vue'),
            'input-field': require('./components/InputField.vue') 
        },

        data () {
            return {
                interactiveModeValue: _cvrContainer.config['interactive_mode'],
                debugModeValue: _cvrContainer.config['debug_mode'],

                morePageUrl: chrome.runtime.getURL('pages/index.html') // store tab id of more page for not open the page mutiplue times
            };
        },

        watch: {
            interactiveModeValue (val) {
                config.set('interactive_mode', val);
            },

            debugModeValue (val) {
                config.set('debug_mode', val);
            }
        },

        beforeCreate () {
            config.get('debug_mode').then((val) => {
                this.debugModeValue = val;
            });
        },

        methods : {
            _ (str) {
                return _(str);
            },

            openMorePage () {
            console.log(this.morePageUrl);
                chrome.tabs.create({
                    url: this.morePageUrl
                });
            }
        }
    }
</script>

<style lang="sass">
    body {
        background: #fff;
    }

    #popup-container {
        width: 150px;
        padding: 0 6px;

        .input-field-row {
            margin: 10px auto;

            label.control-label {
                font-size: 14px;
            }

            .config-title {
                font-size: 14px;
            }
        }
    }
</style>