<template>
    <div id="popup-container" class="row">
        <div class="col-md-12">
            <input-field class="input-field-row" :label="_('init_zoom_level') + '(1-3)'"
                         :rule="['number','require']"
                         v-model="initZoomValue"></input-field>
            <switcher class="input-field-row"
                      :values="[0, 1]"
                      :configTitle="_('debug_mode')"
                      v-model="debugModeValue"></switcher>
        </div>
    </div>
</template>

<script>
    import _ from './modules/_';
    import Config from './modules/Config';
    import { UrlBuilder } from './modules/common';

    export default {
        name : 'popup',

        components : {
            'switcher': require('./components/Switcher.vue'),
            'input-field': require('./components/InputField.vue') 
        },

        data () {
            return {
                debugModeValue: _cvrContainer.config['debug_mode'],
                initZoomValue: _cvrContainer.config['init_zoom_level']
            };
        },

        watch: {
            debugModeValue (val) {
                Config.set('debug_mode', val);
            },

            initZoomValue (val) {
                if (!/^[1-9]\d*$/.test(val) || val > 3) {
                    this.initZoomValue = val = 1;
                }
                Config.set('init_zoom_level', val);
            },
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

    #popup-container {
        width: 150px;
        padding: 0 6px;

        .input-field-row {
            margin: 10px auto;
        }
    }
</style>