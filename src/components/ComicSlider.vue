<!-- For my Chrome extension -->

<template>
    <div class="comic-slider" ref="comicSlider"
         :style="{ width: wrapperWidth + 'px', height: wrapperHeight + 'px' }">
        <div class="info" ref="info"
             v-show="showInfo"
             :style="{'margin-top': infoMTop + 'px'}">
            <input type="text" v-model="_currentPage" @input="pageChangeInput" @click="pageChangeClickHandle"> / <span class="total-page">{{totalPage}}</span>
        </div>
        <div class="process-bar" @mouseover="processBarMouseoverHandle">
            <div class="process-line" :style="{width: processWidth + '%'}"></div>
        </div>
        <div class="items-wrapper"
             ref="itemsWrapper"
             :style="{ width: itemsWrapperWidth + 'px', height: wrapperHeight + 'px', 'left': itemsWrapperLeft + 'px', transition: itemsWrapperTransition }">
                <control v-for="n in (preloadPage + 1)" :index-data="n" ref="gallery" 
                         src-data=""
                         :width="wrapperWidth" :height="wrapperHeight"
                         :style="{ position: 'absolute' }"></control>
        </div>
    </div>
</template>

<script>
    import TapSupportMixin from './TapSupportMixin';

    export default {
        components: {
            'control': require('./Gallery.vue')
        },

        name: 'comic-slider',

        mixins: [TapSupportMixin],

        props: {
            parser       : {
                type   : null,
                default: null
            },
            datasets     : {
                type: Array,
                default () {
                    return [];
                }
            },
            preloadPage: {
                type   : [Number, String],
                default: 2
            },
            showInfo: {
                type   : Boolean,
                default: true
            },
            curPage: {
                type   : Number,
                default: 1
            }
        },

        data () {
            return {
                /* sizes */
                currentPage: 1,
                wrapperWidth: 0,
                wrapperHeight: 0,
                areaWidth: 0,
                areaHeight: 0,

                totalPage  : 0,

                infoHidden: false,

                isMoved: false,
                itemsWrapperTransition: 'all 0.6s',
                direction: 0,

                DESKTOP: 1,
                TOUCHESCREEN: 2,
                interactiveMode: 1
            }
        },

        computed: {
            itemsWrapperWidth () {
                return this.wrapperWidth * this.totalPage;
            },

            itemsWrapperLeft () {
                return -(this._currentPage - 1) * this.wrapperWidth;
            },

            processWidth () {
                return Math.round(this._currentPage / this.totalPage * 100);
            },

            infoMTop () {
                if (this.infoHidden) {
                    return -this.$el.querySelector('.info').offsetHeight;
                } else {
                    return 0;
                }
            },

            /** For self input model **/
            _currentPage: {
                get () {
                    return this.currentPage > this.totalPage ? this.totalPage : this.currentPage;
                },
                set (val) {
                    if (val > 0 && val <= this.totalPage) {
                        this.currentPage = val;
                    }
                }
            }
        },

        watch: {
            interactiveMode (val, oldVal) {
                if (val !== oldVal) {
                    this.initEventListener(val);

                    this.$refs.gallery.forEach((gallery) => {
                        gallery.interactiveMode = val;
                    });
                }
            },

            /** For prop change **/
            curPage (val) {
                this.initControl(val);
            }
        },

        mounted () {
            let _this = this;
            // _this.interactiveMode = this.TOUCHESCREEN; //DEBUG

            window.addEventListener('resize', () => {
                _this.setWrapperSize();
                _this.recomputeGalleryPosition();
            });

            this.$nextTick(() => {
                this.initEventListener(this.interactiveMode);
                this.$refs.itemsWrapper.addEventListener('transitionend', this.transitionend);
                this.setWrapperSize();

                if (this.datasets && this.datasets.length > 0) {
                    this.totalPage = this.datasets.length;
                    this.setControl(this._currentPage); // 初始化Gallery组件
                } else {
                    this.totalPage = this.parser.getTotalPage();
                    this.setControlAsync(this._currentPage);
                }
            });
        },

        methods: {
            initEventListener (mode) {
                if (mode === this.DESKTOP) {
                    this.$off('tap', this._to);
                    this.removeTapSupport(this.$refs.comicSlider);

                    this.$refs.comicSlider.addEventListener('click', this._to);
                    this.$refs.info.addEventListener('click', this.infoClickHandle);
                } else if (mode === this.TOUCHESCREEN) {
                    this.$refs.comicSlider.removeEventListener('click', this._to);
                    this.$refs.info.removeEventListener('click', this.infoClickHandle);

                    this.$on('tap', this._to);
                    this.addTapSupport(this.$refs.comicSlider);
                }
            },

            initControl (curPage) {
                if (curPage > 0 && curPage <= this.totalPage) {
                    this.currentPage = curPage;
                    this.parser ? this.setControlAsync(curPage) : this.setControl(curPage);
                } else {
                    window.console && console.log('Invalid input page number');
                }
            },

            getImgSrc (gallery) {
                if (this.parser) {
                    this.parser.getImgSrc(gallery.extras.page, this.setGalleryImgSrcCallback, this);
                } else {
                    gallery.imgSrc = this.datasets[gallery.extras.page - 1];
                }
            },

            isValidIndex (index) {
                if (this.parser) {
                    return this.parser.isValidIndex(index);
                } else {
                    return this.datasets[index];
                }
            },

            setControl (startPage) {
                this.$emit('init', startPage, this.totalPage);
                this.$refs.gallery.forEach((gallery) => {
                    gallery.extras = { page: startPage };
                    gallery.imgSrc = this.datasets[startPage - 1];
                    gallery.$el.style.left = (gallery.extras.page - 1) * this.wrapperWidth + 'px';
                    startPage++;
                });
            },

            setControlAsync (startPage) {
                this.$emit('init', startPage, this.totalPage);
                this.$refs.gallery.forEach((gallery) => {
                    gallery.extras = { page: startPage };
                    this.parser.getImgSrc(startPage, this.setGalleryImgSrcCallback, this);
                    gallery.$el.style.left = (gallery.extras.page - 1) * this.wrapperWidth + 'px';
                    startPage++;
                });
            },

            setGalleryImgSrcCallback (page, src) {
                this.$refs.gallery.forEach((gallery) => {
                    if (gallery.extras.page == page) {
                        gallery.imgSrc = src;
                    }
                });
            },

            setWrapperSize () {
                this.wrapperWidth = window.innerWidth;
                this.wrapperHeight = window.innerHeight;
            },

            to (direction) {
                if (this.transitionstart)
                    return;

                this.direction = direction;

                if (this.currentPage > 1 && direction == -1) {
                    this.transitionstart = true;
                    this.transitionPrevBefore();
                    this.currentPage--;
                    this.$emit('slide', this.currentPage, this.totalPage);
                } else if (this.currentPage < this.totalPage && direction == 1) {
                    this.transitionstart = true;
                    this.currentPage++;
                    this.$emit('slide', this.currentPage, this.totalPage);
                }
            },

            _to (evt) {
                let clientX = evt.clientX ? evt.clientX : evt.touches[0].clientX;
                return clientX < this.wrapperWidth / 2 ? this.to(-1) : this.to(1);
            },

            transitionPrevBefore () {
                this.$refs.itemsWrapper.insertBefore(this.$refs.itemsWrapper.lastChild, this.$refs.itemsWrapper.firstChild);
                this.$refs.gallery.unshift(this.$refs.gallery.pop());
                this.$refs.gallery[0].extras = { page: this.currentPage - 1 };
                this.$refs.gallery[0].$el.style.left = (this.$refs.gallery[0].extras.page - 1) * this.wrapperWidth + 'px';

                this.getImgSrc(this.$refs.gallery[0]);
            },

            transitionNextComplete () {
                this.$refs.itemsWrapper.appendChild(this.$refs.itemsWrapper.firstChild);
                this.$refs.gallery.push(this.$refs.gallery.shift());
                this.$refs.gallery[this.preloadPage].extras = { page: parseInt(this.currentPage) + parseInt(this.preloadPage) };
                this.$refs.gallery[this.preloadPage].$el.style.left = (this.$refs.gallery[this.preloadPage].extras.page - 1) * this.wrapperWidth + 'px';

                if (this.isValidIndex(this.currentPage + this.preloadPage)) {
                    this.getImgSrc(this.$refs.gallery[this.preloadPage]);
                }
            },

            transitionend () {
                if (this.direction > 0) {
                    this.transitionNextComplete();
                }
                this.transitionstart = false;
                this.direction = 0;
            },

            pageChangeInput (evt) {
                this.initControl(evt.target.value);
            },

            pageChangeClickHandle (evt) {
                evt.stopPropagation();
            },

            infoClickHandle (evt) {
                evt.stopPropagation();
                this.infoHidden = true;
            },

            controlTaponceHandler () {
                console.log(1);
            },

            processBarMouseoverHandle (evt) {
                this.infoHidden = false;
            },

            recomputeGalleryPosition () {
                this.$refs.gallery.forEach((gallery) => {
                    gallery.$el.style.left = (gallery.extras.page - 1) * this.wrapperWidth + 'px';
                });
            }
        }
    }
</script>

<style lang="sass">
    .comic-slider {
        position: fixed;
        top: 0;
        left: 0;
        overflow: hidden;
        background: #000;

        .info {
            position: relative;
            padding: 5px 0;
            width: 100%;
            text-align: center;
            z-index: 10;
            background: rgba(0, 0, 0, 0.3);
            color: #fff;
            transition: all 0.1s;

            input {
                background:rgba(255, 255, 255, 0.6);
                border: none;
                border-radius: 3px;
                width: 3em;
                text-align: center;
            }
        }

        .process-bar {
            position: relative;
            width: 100%;
            height: 2px;
            left: 0px;
            bottom: 0px;
            z-index: 10;

            .process-line {
                position: absolute;
                height: 2px;
                left: 0;
                background: #9acbff;
                transition: all 0.5s;
            }
        }

        .action-area {
            position: absolute;
            z-index: 1;
        }

        .items-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 9;
            transition: all 0.8s;

            .item {
                position: absolute;
            }
        }

        .gallery {
            float: left;
        }
    }
</style>