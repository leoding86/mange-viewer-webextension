<template>
    <div id="app" class="container-fluid">
        <div class="row" v-if="!parserReady">
            <div class="col-md-12">
                <p>Parser is initializing</p>
            </div>
        </div>
        <div class="row" v-if="parserReady">
            <div class="col-md-12">
                <comic-slider :parser="parser"
                              :preloadPage="5"></comic-slider>
            </div>
        </div>
    </div>
</template>

<script>
    import 'bootstrap/dist/css/bootstrap.css';
    import { UrlBuilder } from './modules/common';
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
                parser: null
            }
        },

        beforeCreate () {
            let _this = this;
            let url = new UrlBuilder(window.location.href);
            let params = url.getParams();
            System.import('./parsers/' + params.name + '.js').then((module) => {
                return new module.Parser(params.url);
            }).then((parser) => {
                this.parser = parser;
                this.parserReady = true;
            }, () => {
                alert('Something happened <network issue>');
            });
        },

        methods: {

        }
    }
</script>