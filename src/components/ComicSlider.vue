<!-- For my Chrome extension -->

<template>
    <div class="comic-slider"
         :style="{ width: wrapperWidth + 'px', height: wrapperHeight + 'px' }"
         @click="_to">
        <div class="info" :style="{'margin-top': infoMTop + 'px'}" @click="infoClickHandle">
            <input type="text" v-model="_currentPage" @input="pageChangeInput"> / <span class="total-page">{{totalPage}}</span>
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
                default () {
                    return [];
                }
            },
            preloadPage: {
                type   : [Number, String],
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

                infoHidden: false,

                isMoved: false,
                itemsWrapperTransition: 'all 0.6s',
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
                if (evt.target.value > 0 && evt.target.value <= this.totalPage) {
                    this.parser ? this.setControlAsync(evt.target.value) : this.setControl(evt.target.value);
                } else {
                    window.console && console.log('Invalid input page number');
                }
            },

            infoClickHandle (evt) {
                evt.stopPropagation();
                this.infoHidden = true;
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