<template>
    <div id="app">
        <transition name="fade">
        <div v-if="!parserReady">
            <div class="init"
                 :style="{ 'margin-top': initMTop + 'px' }">
                <p style="text-align: center; font-size:14px;"><img src="./assets/icon128.png" />
                <br />{{initializing_parser}}...</p>
            </div>
        </div>
        <div v-if="parserReady">
            <div>
                <comic-slider :parser="parser"
                              :preloadPage="3"></comic-slider>
            </div>
            <div class="site-info">
                <a :href="siteurl"><img :src="sitelogo" /></a>
            </div>
        </div>
        </transition>
    </div>
</template>

<script>
    import { UrlBuilder } from './modules/common';
    import _ from './modules/_';
    let Parser;

    export default {
        components: {
            'gallery'      : require('./components/Gallery.vue'),
            'comic-slider' : require('./components/ComicSlider.vue')
        },

        name: 'app',

        data () {
            return {
                parserReady: false,
                parser: null,
                initMTop: 0
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
                this.setInitPosition();
            });

            this.$nextTick(() => {
                let _this = this;
                this.setInitPosition();

                let url = new UrlBuilder(window.location.href);
                let params = url.getParams();
                System.import('./parsers/' + params.name + '.js').then((module) => {
                    return new module.Parser(params.url);
                }).then((parser) => {
                    this.parser = parser;
                    this.parserReady = true;
                }, (e) => {
                    alert(_('initializing_parser_failed') + '[parser: ' + params.name + ']');
                });
            });
        },

        methods: {
            setInitPosition () {
                this.initMTop = window.innerHeight * 0.3;
            }
        }
    }
</script>

<style lang="sass">
    .site-info {
        position: fixed;
        bottom: 1px;
        left: 1px;

        img {
            height: 50px;
            opacity: 0.3;
        }

        img:hover {
            opacity: 1;
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