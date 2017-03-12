<!-- For my Chrome extension -->

<template>
    <div class="comic-slider"
         :style="{ width: wrapperWidth + 'px', height: wrapperHeight + 'px' }"
         @click="_to">
        <div class="info">
            <input type="text" v-model="_currentPage" @input="pageChangeInput"> / <span class="total-page">{{totalPage}}</span>
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
    export default {
        components: {
            'control': require('./Gallery.vue')
        },

        name: 'comic-slider',

        props: {
            parser       : {
                type: null,
                default: null
            },
            datasets     : {
                type: Array,
                default: []
            },
            preloadPage: {
                type   : Number,
                default: 2
            }
        },

        data () {
            return {
                /* sizes */
                wrapperWidth: 0,
                wrapperHeight: 0,
                areaWidth: 0,
                areaHeight: 0,

                currentPage: 1,
                totalPage  : 0,

                isMoved: false,
                itemsWrapperTransition: 'all 0.5s',
                direction: 0
            }
        },

        computed: {
            itemsWrapperWidth () {
                return this.wrapperWidth * this.totalPage;
            },
            itemsWrapperLeft () {
                return -(this._currentPage - 1) * this.wrapperWidth;
            },
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
            
        },

        mounted () {
            let _this = this;

            window.addEventListener('resize', () => {
                _this.setWrapperSize();
                _this.recomputeGalleryPosition();
            });

            this.$nextTick(() => {
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
            setControl (startPage) {
                this.$refs.gallery.forEach((gallery) => {
                    gallery.extras = { page: startPage };
                    gallery.imgSrc = this.datasets[startPage - 1];
                    gallery.$el.style.left = (gallery.extras.page - 1) * this.wrapperWidth + 'px';
                    startPage++;
                });
            },

            setControlAsync (startPage) {
                this.$refs.gallery.forEach((gallery) => {
                    gallery.extras = { page: startPage };
                    this.parser(this.setGalleryImgSrcCallback);
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
                } else if (this.currentPage < this.totalPage && direction == 1) {
                    this.transitionstart = true;
                    this.currentPage++;
                }
            },

            _to (evt) {
                return evt.clientX < this.wrapperWidth / 2 ? this.to(-1) : this.to(1);
            },

            transitionPrevBefore () {
                this.$refs.itemsWrapper.insertBefore(this.$refs.itemsWrapper.lastChild, this.$refs.itemsWrapper.firstChild);
                this.$refs.gallery.unshift(this.$refs.gallery.pop());
                this.$refs.gallery[0].extras = { page: this.currentPage - 1 };
                this.$refs.gallery[0].$el.style.left = (this.$refs.gallery[0].extras.page - 1) * this.wrapperWidth + 'px';

                this.$refs.gallery[0].imgSrc = this.datasets[this.currentPage - 2];
            },

            transitionNextComplete () {
                this.$refs.itemsWrapper.appendChild(this.$refs.itemsWrapper.firstChild);
                this.$refs.gallery.push(this.$refs.gallery.shift());
                this.$refs.gallery[this.preloadPage].extras = { page: parseInt(this.currentPage) + parseInt(this.preloadPage) };
                this.$refs.gallery[this.preloadPage].$el.style.left = (this.$refs.gallery[this.preloadPage].extras.page - 1) * this.wrapperWidth + 'px';

                if (this.datasets[this.currentPage + this.preloadPage]) {
                    this.$refs.gallery[this.preloadPage].imgSrc = this.datasets[this.$refs.gallery[this.preloadPage].extras.page - 1];
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
                if (evt.target.value > 0 && evt.target.value <= this.totalPage) {
                    this.parser ? this.setControlAsync(evt.target.value) : this.setControl(evt.target.value);
                } else {
                    console.notice('Invalid input page number');
                }
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
        overflow: hidden;
        background: #000;

        .info {
            position: absolute;
            width: 100%;
            text-align: center;
            z-index: 10;
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
            transition: all 0.5s;

            .item {
                position: absolute;
            }
        }

        .gallery {
            float: left;
        }
    }
</style>