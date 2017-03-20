<template>
    <div id="app">
        <div v-if="!parserReady">
            <div class="init"
                 :style="{ 'margin-top': initMTop + 'px' }">
                <p style="text-align: center; font-size:14px;"><img src="./assets/icon128.png" />
                <br />{{initializing_parser}}...</p>
            </div>
        </div>
        <div v-if="parserReady">
            <span class="info-toggler icon-toggler"
                      @click="infoTogglerClickHandler">i</span>
            <div class="comic-info" :class="{ 'comic-info-deactive': comicInfoDeactive }">
                <div class="site-info">
                    <a :href="siteurl"><img :src="sitelogo" /></a>
                </div>
                <div class="pages">
                    <input type="text"
                           :value="inputPage"
                           @keyup.enter="inputEnterHandler"
                           @click="pageInputClickHandler" /> / <span>{{comicPages}}</span>
                </div>
            </div>
            <span class="config-toggler icon-toggler"
                  @click="configTogglerClickHandler"></span>
            <div class="config-panel" v-show="configPanelActive">
                <switcher :values="modeSwitcherValues"
                          :configTitle="modeConfigTitle"
                          @switch="modeSwitchHandle"></switcher>
            </div>
            <comic-slider ref="comicSlider"
                          :parser="parser"
                          :preloadPage="5"
                          :curPage="sliderCurPage"
                          :showInfo="false"
                          @init="sliderInit"
                          @slide="sliderSlideHandler"></comic-slider>
        </div>
    </div>
</template>

<script>
    import { UrlBuilder } from './modules/common';
    import _ from './modules/_';
    // let Parser;

    export default {
        components: {
            'gallery'      : require('./components/Gallery.vue'),
            'comic-slider' : require('./components/ComicSlider.vue'),
            'switcher'     : require('./components/Switcher.vue')
        },

        name: 'app',

        data () {
            return {
                parserReady: false,
                parser: null,
                initMTop: 0,
                sliderCurPage: 1,
                inputPage: 1,
                comicPages: '?',
                comicInfoDeactive: false,
                configPanelActive: false,
                modeConfigTitle: _('interactive_mode'),
                modeSwitcherValues: [1, 2],

                /* styles */
            }
        },

        computed: {
            siteurl () {
                return this.parser.getSiteurl();
            },
            sitelogo () {
                return this.parser.getSitelogo();
            },
            initializing_parser () {
                return _('initializing_parser');
            }
        },

        mounted () {
            window.addEventListener('resize', () => {
                this.initPosition();
            });

            this.$nextTick(() => {
                let _this = this;
                this.initPosition();

                let url = new UrlBuilder(window.location.href);
                let params = url.getParams();
                System.import('./parsers/' + params.name + '.js').then((module) => {
                    return new module.Parser(params.url);
                }).then((parser) => {
                    this.parser = parser;
                    this.parserReady = true;
                }, (e) => {
                    alert(_('initializing_parser_failed') + '[' + e + '][parser: ' + params.name + ']');
                });
            });
        },

        methods: {
            initPosition () {
                this.initMTop = window.innerHeight * 0.3;
            },

            modeSwitchHandle (val) {
                this.$refs.comicSlider.interactiveMode = val;
            },

            sliderSlideHandler (curPage, totalPage) {
                this.inputPage = curPage;
            },

            sliderInit (curPage, totalPage) {
                this.comicPages = totalPage;
                this.inputPage = curPage;
            },

            inputEnterHandler (evt) {
                this.sliderCurPage = parseInt(evt.target.value);
            },

            pageInputClickHandler (evt) {
                evt.target.setSelectionRange(0, evt.target.value.length);
            },

            infoTogglerClickHandler () {
                this.comicInfoDeactive = !this.comicInfoDeactive;
            },

            configTogglerClickHandler () {
                this.configPanelActive = !this.configPanelActive;
            }
        }
    }
</script>

<style lang="sass">
    $top: 999;

    .comic-info {
        width: 100%;
        height: 25px;
        position: relative;
        top: 0px;
        z-index: $top;
        text-align: center;

        .site-info {
            position: fixed;
            bottom: 3px;
            left: 3px;

            img {
                height: 20px;
                opacity: 0.3;
            }

            img:hover {
                opacity: 1;
            }
        }

        .pages {
            display: inline-block;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.5);
            overflow: hidden;
            padding: 0 10px;
            color: #fff;
            position: relative;
            top: 3px;

            input {
                width: 3em;
                border: 0;
                background: none;
                color: #fff;
                text-align: center;
            }

            span {
                font-size: 14px;
                font-weight: 700;
            }
        }
    }

    .comic-info-deactive {
        top: -50px;
    }

    .icon-toggler {
        width: 20px;
        height: 20px;
        border-radius: 10px;
        font-weight: 700;
        color: #fff;
        text-align: center;
        line-height: 20px;
        background: rgba(255, 255, 255, 0.3);
        cursor: pointer;
        opacity: 0.5;
        position: fixed;
        z-index: $top + 1;

        &:hover {
            opacity: 1;
        };
    }

    .info-toggler {
        top: 3px;
        right: 3px;
    }

    .config-toggler {
        background: rgba(255, 255, 255, 0.3) url(./assets/icon_config.png) center center no-repeat;
        background-size: 50% 50%;
        right: 3px;
        bottom: 3px;
    }

    .config-panel {
        padding: 5px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.33);
        position: fixed;
        bottom: 26px;
        right: 3px;
        color: #fff;
        z-index: $top + 1;

        a {
            color: #fff;
        }
    }

    .init {
        img {
            animation-duration: 2s;
            animation-iteration-count: infinite;
            animation-name: logo_animation;
        }
    }

    @keyframes logo_animation {
        from {
            transform: scale(1);
        }

        50% {
            transform: scale(0.8);
        }

        to {
            transform: scale(1);
        }
    }
</style>