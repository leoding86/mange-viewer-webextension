<template>
    <div class="gallery"
         :style="{
        position: 'relative',
        overflow: 'hidden',
        width: width + 'px',
        height: height + 'px'
        }"
        :zoom-max="zoomMax"
        @click="galleryClickHandler">
        <img :src-data="srcData" :alt-data="altData"
             :style="{
                 position: 'relative',
                 transition: imgStyle.transition,
                 width: imgStyle.width + 'px',
                 height: imgStyle.height + 'px',
                 top: imgStyle.top + 'px',
                 left: imgStyle.left + 'px'
             }"
             @dragstart="() => {return false}"
             draggable="false" @transitionend="(evt) => { evt.stopPropagation(); }" />
        <div class="status" v-if="!isComplete"
             :style="{ top: statusTop + 'px' }">
            <div class="info">{{statusInfo}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'gallery',

        props: {
            srcData: {
                type: String,
                default: null
            },

            altData: {
                type: String,
                default: 'untitle'
            },

            width: {
                type: [String, Number]
            },

            height: {
                type: [String, Number]
            },

            zoomMax: {
                type: [Number, String],
                default: 4
            }
        },

        data () {
            return {
                $img  : null,
                zoom : 1,
                scale : 0,
                imgSrc : null,
                imgSize  : {
                    width: 0, height: 0
                },
                imgStyle : {
                    left: 0, top: 0,
                    width: 0, height: 0,
                    transition: 'all 0s'
                },
                imgInitOffsetLeft: 0,
                imgInitOffsetTop : 0,
                imgOffsetLeft    : 0,
                imgOffsetTop     : 0,
                isComplete: true,
                pointDownX: 0,
                pointDownY: 0,
                pointMoveX: 0,
                pointMoveY: 0,
                minOffsetLeft: null,
                minOffsetTop: null,
                reachedEdge : false,
                mousemoved : false,
                statusInfo: 'waiting',

                extras : {} // For some extras data
            }
        },

        watch: {
            imgSrc (val) {
                this.isComplete = false;
                this.imgStyle.transition = 'all 0s';
                this.$img.src = '';
                this.init();
            },

            width (val) {
                this.init();
            },

            height (val) {
                this.init();
            }
        },

        computed: {
            statusTop () {
                if (this.$el && this.$el.querySelector('.status')) {
                    return this.height / 2 - this.$el.querySelector('.status').offsetHeight;
                } else {
                    return this.height / 2 - 15;
                }
            }
        },

        mounted () {
            this.$img = this.$el.querySelector('img');
            this.$img.addEventListener('load', this.imageLoadHandler);
            this.$img.addEventListener('error', this.imgeErrorHandler);
            this.$img.addEventListener('wheel', this.imageWheelHandler);
            this.$img.addEventListener('mousedown', this.imageMouseDownHandler);
            this.imgSrc = this.srcData;

            this.$nextTick(() => {
                this.init();
            });
        },

        methods: {
            init () {
                this.zoom  = 1;
                this.scale = 0;
                this.imgSize.width   = this.imgStyle.width  = 0;
                this.imgSize.height  = this.imgStyle.height = 0;
                this.imgStyle.left   = 0;
                this.imgStyle.top    = 0;
                this.imgStyle.transition = 'all 0s';
                this.imgInitOffsetLeft = this.imgInitOffsetTop = 0;
                this.imgOffsetTop = this.imgOffsetLeft = 0;
                this.pointDownX = this.pointDownY = this.pointMoveX = this.pointY = 0;
                this.minOffsetLeft = null;
                this.minOffsetTop = null;
                this.mousemoved = false;

                if (this.imgSrc) {
                    this.$img.alt = this.altData;
                    this.$img.src = this.imgSrc;
                }
            },

            imageLoadHandler () {
                this.isComplete = true;

                /* How to fill wrapper */
                this.determineImageFill();

                this.imgStyle.width  = this.imgSize.width;
                this.imgStyle.height = this.imgSize.height;
                this.imgStyle.left = this.imgInitOffsetLeft;
                this.imgStyle.top = this.imgInitOffsetTop;
                setTimeout(() => {
                    this.imgStyle.transition = 'all 0.2s';
                }, 500);
            },

            imageErrorHandler () {
                this.imgSrc = null;
                this.imgSrc = this.$img.target.src;
            },

            imageWheelHandler (e) {
                e.preventDefault();
                let zoom = null;
                if (e.deltaY < 0 && this.zoom < this.zoomMax) {
                    zoom = 1;
                } else if (e.deltaY > 0 && this.zoom > 1) {
                    zoom = -1;
                }
                this.calcTargetOffset(e, zoom);
            },

            imageMouseDownHandler (e) {
                this.pointDownX = e.clientX;
                this.pointDownY = e.clientY;
                this.imgOffsetLeft = this.imgStyle.left;
                this.imgOffsetTop  = this.imgStyle.top;
                this.imgStyle.transition = 'all 0s';

                window.addEventListener('mouseup', this.imageMouseUpHandler);
                window.addEventListener('mousemove', this.imageMouseMoveHandler);
            },

            imageMouseUpHandler (e) {
                this.imgStyle.transition = 'all 0.2s';
                window.removeEventListener('mousemove', this.imageMouseMoveHandler);
                window.removeEventListener('mouseup', this.imageMouseUpHandler);
            },

            imageMouseMoveHandler (e) {
                if (!this.mousemoved && (e.movementX != 0 || e.movementY != 0)) {
                    this.mousemoved = true;
                    return;
                }

                this.pointMoveX = e.clientX;
                this.pointMoveY = e.clientY;

                if (this.zoom == 1 || this.imgStyle.width <= this.width) {
                    // Do nothing
                } else {
                    let computedLeft = this.imgOffsetLeft + this.pointMoveX - this.pointDownX;

                    if (computedLeft >= 0) {
                        this.imgStyle.left = 0;
                    } else if (this.minOffsetLeft && computedLeft <= this.minOffsetLeft) {
                        this.imgStyle.left = this.minOffsetLeft;
                    } else {
                        e.stopPropagation();
                        this.imgStyle.left = computedLeft;
                    }
                }

                if (this.zoom == 1 || this.imgStyle.height <= this.height) {
                    // Do nothing
                } else {
                    let computedTop = this.imgOffsetTop + this.pointMoveY - this.pointDownY;

                    if (computedTop >= 0) {
                        this.imgStyle.top = 0;
                    } else if (this.minOffsetTop && computedTop <= this.minOffsetTop) {
                        this.imgStyle.top = this.minOffsetTop;
                    } else {
                        this.imgStyle.top = computedTop;
                    }
                }

            },

            galleryClickHandler (e) {
                if (this.mousemoved) {
                    e.stopPropagation();
                }
                this.mousemoved = false;
            },

            calcTargetOffset (evt, zoom) {
                this.scale = zoom / this.zoom;
                this.zoom += zoom;

                this.imgStyle.width  = this.imgSize.width * this.zoom;
                this.imgStyle.height = this.imgSize.height * this.zoom;

                if (this.zoom == 1) {
                    this.imgStyle.left = this.imgInitOffsetLeft;
                    this.imgStyle.top  = this.imgInitOffsetTop;
                    return;
                }

                let targetOffsetLeft = null;
                let targetOffsetTop = null;

                if (this.imgStyle.width <= this.width) {
                    this.minOffsetTop = this.height - this.imgStyle.height;
                    targetOffsetLeft  = (this.width - this.imgStyle.width) / 2;
                    targetOffsetTop   = this.imgStyle.top - evt.layerY * this.scale;
                } else if (this.imgStyle.height <= this.height) {
                    this.minOffsetLeft = this.width - this.imgStyle.width;
                    targetOffsetTop    = (this.height - this.imgStyle.height) / 2;
                    targetOffsetLeft   = this.imgStyle.left - evt.layerX * this.scale;
                } else {
                    this.minOffsetLeft = this.width - this.imgStyle.width;
                    this.minOffsetTop  = this.height - this.imgStyle.height;
                    targetOffsetTop    = this.imgStyle.top - evt.layerY * this.scale;
                    targetOffsetLeft   = this.imgStyle.left - evt.layerX * this.scale;
                }

                /* check */
                if (targetOffsetLeft >= 0 && this.imgStyle.width > this.width) {
                    this.imgStyle.left = 0;
                } else if (this.minOffsetLeft < 0 && targetOffsetLeft <= this.minOffsetLeft) {
                    this.imgStyle.left = this.minOffsetLeft;
                } else {
                    this.imgStyle.left = targetOffsetLeft;
                }

                if (targetOffsetTop >= 0 && this.imgStyle.height > this.height) {
                    this.imgStyle.top = 0;
                } else if (this.minOffsetTop < 0 && targetOffsetTop <= this.minOffsetTop) {
                    this.imgStyle.top = this.minOffsetTop;
                } else {
                    this.imgStyle.top = targetOffsetTop;
                }
            },

            determineImageFill () {
                let width = this.$el.offsetWidth;
                let height = this.$el.offsetHeight;

                if (width / height > this.$img.naturalWidth / this.$img.naturalHeight) {
                    this.imgSize.height = height;
                    this.imgSize.width = this.$img.naturalWidth * (this.imgSize.height / this.$img.naturalHeight);
                } else {
                    this.imgSize.width = width;
                    this.imgSize.height = this.$img.naturalHeight * (this.imgSize.width / this.$img.naturalWidth);
                }

                this.imgInitOffsetLeft = (width - this.imgSize.width) / 2;
                this.imgInitOffsetTop = (height - this.imgSize.height) / 2;
            }
        }
    }
</script>

<style lang="sass">
    .gallery {
        .status {
            position: absolute;
            width: 100%;
            z-index: 99;
            text-align: center;

            .info {
                display: inline-block;
                color: #fff;
            }
        }
    }
</style>