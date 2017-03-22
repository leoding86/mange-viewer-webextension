<template>
    <div class="cvr-app-container">
        <div class="cvr-app-show-btn" @click="appShowBtnClickHandler">
            <span style="color:#1c6af8;font-weight:700">C</span><span style="color:#aa2c1b;font-weight:700">V</span><span style="color:#179709;font-weight:700">R</span>
        </div>
        <debug-panel style="position:fixed;bottom:3px;left:3px;z-index:9999"
                     v-if="debugModeActive"></debug-panel>
        <div class="cvr-app" v-show="showApp"
             :style="{ width: containerWidth + 'px', height: containerHeight + 'px' }">
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
                    <switcher :values="[1, 2]"
                              :configTitle="modeConfigTitle"
                              v-model="interactiveMode"></switcher>
                    <switcher :values="[0, 1]"
                              :configTitle="debugModeTitle"
                              v-model="debugMode"></switcher>
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
    </div>
</template>

<script>
    import { Matcher } from './modules/common';
    import _ from './modules/_';
    import Debug from './components/CvrDebugEvent'
    // let Parser;

    export default {
        components: {
            'gallery'      : require('./components/Gallery.vue'),
            'comic-slider' : require('./components/ComicSlider.vue'),
            'switcher'     : require('./components/Switcher.vue'),
            'debug-panel'   : require('./components/DebugPanel.vue')
        },

        name: 'app',

        data () {
            return {
                containerWidth: 0,
                containerHeight: 0,
                parserReady: false,
                parser: null,
                showApp: false,
                initMTop: 0,
                sliderCurPage: 1,
                inputPage: 1,
                comicPages: '?',
                comicInfoDeactive: false,
                configPanelActive: false,
                modeConfigTitle: _('interactive_mode'),
                debugModeTitle: _('debug_mode'),
                interactiveMode: 1, // 1: desktop; 2: touchscreen
                debugMode: 0,
                open: _('open'),

                viewportmeta: null

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
            },
            debugModeActive () {
                return this.debugMode === 1 ? true : false;
            }
        },

        mounted () {
            window.addEventListener('resize', () => {
                this.initPosition();
            });

            this.$nextTick(() => {
                let _this = this;

                let viewportmeta = document.querySelector('meta[name="viewport"]');
                if (viewportmeta) {
                    this.viewportmeta = viewportmeta;
                }

                this.initPosition();

                let matcher = new Matcher(window.location.href);
                let parser = matcher.is();
                if (parser !== null) {
Debug.emit('Initializing parser');

                    let p = require('./parsers/' + parser + '.js');
                    (new p.Parser(window.location.href)).then((parser) => {
Debug.emit('Praser is ready');
                        this.parser = parser;
                        this.parserReady = true;
                    });
                }
            });
        },

        watch: {
            interactiveMode (val) {
                this.$refs.comicSlider.interactiveMode = val;
                if (val === 2) {
                    let viewportmeta = null;
                    if (this.viewportmeta) {
                        viewportmeta = document.querySelector('meta[name="viewport"]');
                    } else {
                        viewportmeta = document.createElement('meta');
                        viewportmeta.name = 'viewport';
                        document.querySelector('head').appendChild(viewportmeta);
                    }
                    viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
                } else {
                    if (this.viewportmeta) {
                        document.querySelector('meta[name="viewport"]').content = this.viewportmeta.content;
                    } else {
                        document.querySelector('meta[name="viewport"]').remove();
                    }
                }
            }
        },

        methods: {
            initPosition () {
                this.containerWidth = window.innerWidth;
                this.containerHeight = window.innerHeight;
                this.initMTop = window.innerHeight * 0.3;
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
Debug.emit((this.configPanelActive ? 'Show' : 'Hide') + ' config panel');
            },

            appShowBtnClickHandler () {
                this.showApp = !this.showApp;
                if (this.showApp) {
Debug.emit('Show app viewer');
                    document.querySelector('body').style.overflow = 'hidden';
                } else {
Debug.emit('Hide app viewer');
                    document.querySelector('body').style.overflow = 'auto';
                }
            }
        }
    }
</script>

<style lang="sass">
    $top: 99999;

    .cvr-app-container {
        position: fixed;
        top: 0;
        left: 0;
        z-index: $top;
    }

    .cvr-app-show-btn {
        font-size: 14px;
        color: #fff;
        background: #000;
        position: fixed;
        z-index: $top + 1;
        right: 3px;
        bottom: 3px;
        cursor: pointer;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
        padding: 3px;
        border-radius: 3px;
    }

    .cvr-app {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

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
            background: rgb(255, 255, 255);
            overflow: hidden;
            padding: 0 10px;
            color: #000;
            position: relative;
            top: 3px;
            box-shadow: 0 0 3px #000;
            opacity: 0.8;

            input {
                width: 3em;
                border: 0;
                background: none;
                color: #000;
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
        color: #000;
        text-align: center;
        line-height: 20px;
        background: rgb(255, 255, 255);
        cursor: pointer;
        opacity: 0.8;
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

    $configTogglerBottom: 30px;

    .config-toggler {
        background: rgb(255, 255, 255) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjY5OTJGMzAwRDVBMTFFNzhDODdCNjJDNEVFQUUxRTYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjY5OTJGMkYwRDVBMTFFNzhDODdCNjJDNEVFQUUxRTYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzFFQkUyOTAwRDNBMTFFNzhCQTFFOTQ3NUZFRjU2QUMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzFFQkUyOTEwRDNBMTFFNzhCQTFFOTQ3NUZFRjU2QUMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5vaDiqAAADmElEQVR42ryZT2xMQRzH95XQiyLEv5BosIiiEqSNskUbFaHVQ10aNogbmpCsizg1qYNs4tAQFAeROCDpgURItqj/Ef1jHciWcqAkKNFqeH4TvyYvL7Mzv5k3M5N8DrvvvZn5zr/fn/FibstZoAboBZ4DnUAG+KZboe/7RjrWACwlvlvG2uXwFbgM1OkKiSImCfRgR/4SxbTnERIk4UpIJfCA04FPQJHgu70EEYzdtoVMBE5KOvEBOASUA/OB1cAe4CZRBGONbSGtCp2JwhxdIQXE9/84OtW2226gzNGM/ASm297sTxyJeQcssLW0WPniaHmxffISSAEzQsvuEnA6SuUFaH19xwwB94FXof9T4RnxiEKagLSieLYUs0AOGx+Px3IJsNjAzBUDfSr7g22+YeIIsiVxABsRFeYJNAMDEWbrocpmnwm8IVQ6AhzUGFXmDZyIIKaaJ2Qj0AhU4IjtR4dOVllW5ZTJUzYrzHqQrrCQRs0R6ca1b6KUaIpJBIXc06iAnWITDB+95Yp9GATio0Imac7GOkt25Bh1WQHzgkurXkNEu2Wj+F7Sfh/ghU+ttIaQuGUhsviliedrqe6PZw7clHHAL0EfKnm+lmowc82BkN/AbcHzYZ4PdUaxkceOnMdOwbOpPCH7mIUELhAbeOtISE7wbBXFKH2U7JFZjoRsEfShXxaPsBTPJkkDYxwJGSt4Nht9NGnJCEaj1JEQSgqJHQg7RRFiRtBA3JEQSsyyAbjoed71fEJGBB8nHAmpUni3Nt+DK4LpHHAgoljRSN/hVVIosao+Jq9tllOKQpp5ldwifNhvUcQ0Dd+vIlgBi/KeKnx83JKQu4oiPgcDq4XAD42RqDcsokWjD61BIXUREgC1hkQcVUirBn8vDwrxAvknHY5EEMAOl/OENjowSTEZbQw7nlfwsihRZsXHuKZaUUQSc72yuttUk9gvDKQ5HwGHMYNfxDmRqvCgeG0ikMsnZInh3O13TPB1ofs/pFHHMt1rhRZO7uoGpkNdJ7F7o96PnMNAaxvHz+pwKORqVCGmXQhdcraF6FhgXZK2hZTG3F3FSYUURBDSw0vLEMqgJN4Jl6ztmGFR7P+1NWVUWUi6Cy0yS3yzu8GtGEeIvku72CM1RBEpQp6M546spXTChBCK8aQk86ag4fQxV6DkUZsQEkPfqk2QC9tBrGduODhSFeIZ2i+F6EOtB1bibHXjb6tldDb+CTAAKXhYW3uLHMIAAAAASUVORK5CYII=) center center no-repeat;
        background-size: 50% 50%;
        box-shadow: 0 0 3px #000;
        right: 3px;
        bottom: $configTogglerBottom;
    }

    .config-panel {
        width: 120px;
        padding: 5px;
        border-radius: 3px;
        background: rgb(255, 255, 255);
        box-shadow: 0 0 3px #000;
        position: fixed;
        bottom: $configTogglerBottom + 26;
        right: 3px;
        color: #000;
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