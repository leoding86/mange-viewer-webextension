<template>
    <div class="popup-content">
        <switcher :values="[0, 1]"
                  :configTitle="_('debug_mode')"
                  v-model="debugModeValue"></switcher>
    </div>
</template>

<script>
    import _ from './modules/_';
    import Config from './modules/Config';
    import { UrlBuilder } from './modules/common';

    export default {
        name : 'popup',

        components : {
            'switcher': require('./components/Switcher.vue')
        },

        data () {
            return {
                debugModeValue: _cvrContainer.config.debug_mode
            };
        },

        watch: {
            debugModeValue (val) {
                Config.set('debug_mode', val);
            }
        },

        beforeCreate () {
            Config.get('debug_mode').then((val) => {
                this.debugModeValue = val;
            });
        },

        mounted () {
            
        },

        methods : {
            _ (str) {
                return _(str);
            }
        }
    }
</script>

<style lang="sass">
    body {
        background: #fff;
    }

    .popup-content {
        width: 120px;
    }
</style>