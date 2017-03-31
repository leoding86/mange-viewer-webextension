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
             ondragstart="return false;"
             draggable="false" @transitionend="(evt) => { evt.stopPropagation(); }" />
        <div class="status" v-if="!isComplete"
             :style="{ top: statusTop + 'px' }">
            <div class="info">{{statusInfo}}</div>
        </div>
    </div>
</template>

<script>
    import TapSupportMixin from './TapSupportMixin';
    import Debug from './CvrDebugEvent';

    export default {
        name: 'gallery',

        mixins: [TapSupportMixin],

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
            },

            initZoom: {
                type: [Number, String],
                default: 1
            },

            /**
             * 1: wheel: zoom
             * 2: ctrl+wheel: zoom, wheel: veritcal move
             */
            zoomMode: {
                type: [Number, String],
                default: 1
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
                imgOffsetLeft    : 0, // need ?
                imgOffsetTop     : 0, // need ?
                isComplete: true,
                pointDownX: 0,
                pointDownY: 0,
                pointMoveX: 0, // need ?
                pointMoveY: 0, // need ?
                minOffsetLeft: null,
                minOffsetTop: null,
                reachedEdge : false,
                mousemoved : false,
                statusInfo: 'waiting',

                DESKTOP: 1,
                TOUCHSCREEN: 2,
                interactiveMode: 1,
                oldDistance: null,

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
            },

            interactiveMode (val, oldVal) {
                if (val !== oldVal) {
                    this.initEventListener(val);
                }
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
            // this.interactiveMode = this.TOUCHSCREEN; // debug

            this.$img = this.$el.querySelector('img');
            this.$img.addEventListener('load', this.imageLoadHandler);
            this.$img.addEventListener('error', this.imgeErrorHandler);
            this.initEventListener(this.interactiveMode);
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

            initEventListener (mode) {
                if (mode === this.DESKTOP) {
                    /* 取消事件 */
                    this.$off('tap', this.imageTaphandler);
                    this.$off('dbtap', this.imageDbtapHandler);
                    this.$img.removeEventListener('touchstart', this.imageTouchstartHandler);
                    this.$img.removeEventListener('touchmove', this.imageTouchmoveHandler);
                    this.$img.removeEventListener('touchend', this.imageTouchendHandler);
                    this.removeTapSupport(this.$img);

                    /* 绑定新事件 */
                    this.$img.addEventListener('wheel', this.imageWheelHandler);
                    this.$img.addEventListener('mousedown', this.imageMouseDownHandler);
                } else if (mode === this.TOUCHSCREEN) {
                    this.$img.removeEventListener('wheel', this.imageWheelHandler);
                    this.$img.removeEventListener('mousedown', this.imageMouseDownHandler);

                    /* 绑定新事件 */
                    this.$on('tap', this.imageTaphandler);
                    this.$on('dbtap', this.imageDbtapHandler);
                    this.$img.addEventListener('touchstart', this.imageTouchstartHandler);
                    this.$img.addEventListener('touchmove', this.imageTouchmoveHandler);
                    this.$img.addEventListener('touchend', this.imageTouchendHandler);
                    this.addTapSupport(this.$img);
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
                this.calcTargetOffset(0, 0, this.initZoom - 1); // init zoom

                setTimeout(() => {
                    this.imgStyle.transition = 'all 0.2s';
                }, 500);
            },

            imageErrorHandler () {
                this.imgSrc = null;
                this.imgSrc = this.$img.target.src;
            },

            imagePointMove (clientX, clientY, e) {
                this.pointMoveX = clientX;
                this.pointMoveY = clientY;

                if (this.zoom == 1 || this.imgStyle.width <= this.width) {
                    // Do nothing
                } else {
                    this.imageMoveHorizontal(this.pointMoveX - this.pointDownX);
                }

                if (this.zoom == 1 || this.imgStyle.height <= this.height) {
                    // Do nothing
                } else {
                    this.imageMoveVertical(this.pointMoveY - this.pointDownY);
                }
            },

            imageMoveVertical (distance) {
                let computedTop = this.imgOffsetTop + distance;

                if (computedTop >= 0) {
                    this.imgStyle.top = 0;
                } else if (this.minOffsetTop && computedTop <= this.minOffsetTop) {
                    this.imgStyle.top = this.minOffsetTop;
                } else {
                    this.imgStyle.top = computedTop;
                }
            },

            imageMoveHorizontal (distance) {
                let computedLeft = this.imgOffsetLeft + distance;

                if (computedLeft >= 0) {
                    this.imgStyle.left = 0;
                } else if (this.minOffsetLeft && computedLeft <= this.minOffsetLeft) {
                    this.imgStyle.left = this.minOffsetLeft;
                } else {
                    this.imgStyle.left = computedLeft;
                }
            },

            imageWheelHandler (e) {
                e.preventDefault();

                if (this.zoomMode == 1 || (this.zoomMode == 2 && e.ctrlKey)) {
                    let zoom = null;
                    if (e.deltaY < 0 && this.zoom < this.zoomMax) {
                        zoom = 1;
                    } else if (e.deltaY > 0 && this.zoom > 1) {
                        zoom = -1;
                    }
                    this.calcTargetOffset(e.offsetX, e.offsetY, zoom);
                } else {
                    if (this.zoomMode == 2) {
                        if (this.zoom > 1) {
                            this.imageMoveVertical(e.deltaY > 0 ? -50 : 50);
                            this.imgOffsetTop = this.imgStyle.top;
                        }
                    }
                }
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
                this.imagePointMove(e.clientX, e.clientY, e);
            },

            imageTouchstartHandler (e) {

                if (e.touches.length == 1) {
                    this.pointDownX = e.touches[0].clientX;
                    this.pointDownY = e.touches[0].clientY;
                    this.imgOffsetLeft = this.imgStyle.left;
                    this.imgOffsetTop  = this.imgStyle.top;
                    this.imgStyle.transition = 'all 0s';
                } else if (e.touches.length > 1) {
                    this.oldDistance = this.calDistance(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                }
            },

            imageTouchendHandler (e) {
                if (e.touches.length == 1) {
                    this.pointDownX = e.touches[0].clientX;
                    this.pointDownY = e.touches[0].clientY;
                    this.imgOffsetLeft = this.imgStyle.left;
                    this.imgOffsetTop  = this.imgStyle.top;
                    this.imgStyle.transition = 'all 0s';
                }
            },

            imageTouchmoveHandler (e) {
                e.preventDefault();

                if (e.touches.length == 1) {
                    this.imagePointMove(e.touches[0].clientX, e.touches[0].clientY, e);
                } else if (e.touches.length > 1) {
                    let distance = this.calDistance(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );

                    // console.log(distance, this.oldDistance);

                    let zoom = 0;
                    if (distance > this.oldDistance) {
                        zoom = 0.03;
                    } else if (distance < this.oldDistance) {
                        zoom = -0.03;
                    }

                    this.oldDistance = distance;

                    let vpoint = {
                        x: Math.round((e.touches[0].clientX + e.touches[1].clientX) / 2),
                        y: Math.round((e.touches[0].clientY + e.touches[1].clientY) / 2)
                    }

                    this.calcTargetOffset(
                        vpoint.x - this.imgStyle.left,
                        vpoint.y - this.imgStyle.top,
                        zoom
                    );
                }
            },

            imageDbtapHandler (evt) {
                evt.stopPropagation();
                let zoom = null;
                if (this.zoom < this.zoomMax) {
                    zoom = 1;
                } else if (this.zoom >= this.zoomMax) {
                    zoom = - (this.zoomMax - 1);
                }

                this.imgStyle.transition = 'all 0.2s';
                this.calcTargetOffset(
                    evt.targetTouches[0].clientX - this.imgStyle.left,
                    evt.targetTouches[0].clientY - this.imgStyle.top,
                    zoom
                );
            },

            imageTaphandler (evt) {

            },

            galleryClickHandler (e) {
                if (this.mousemoved) {
                    e.stopPropagation();
                }
                this.mousemoved = false;
            },

            calcTargetOffset (x, y, zoom) {
                if (this.zoom == this.zoom + zoom) {
                    return;
                }

                if ((this.zoom + zoom) > this.zoomMax) {
                    return;
                } else if ((this.zoom + zoom) < 1) {
                    return;
                } else {
                    this.scale = zoom / this.zoom;
                    this.zoom += zoom;
                }

Debug.emit('zoom to ' + this.zoom + ' time(s)');

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
                    targetOffsetTop   = this.imgStyle.top - y * this.scale;
                } else if (this.imgStyle.height <= this.height) {
                    this.minOffsetLeft = this.width - this.imgStyle.width;
                    targetOffsetTop    = (this.height - this.imgStyle.height) / 2;
                    targetOffsetLeft   = this.imgStyle.left - x * this.scale;
                } else {
                    this.minOffsetLeft = this.width - this.imgStyle.width;
                    this.minOffsetTop  = this.height - this.imgStyle.height;
                    targetOffsetTop    = this.imgStyle.top - y * this.scale;
                    targetOffsetLeft   = this.imgStyle.left - x * this.scale;
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

                this.imgOffsetTop = this.imgStyle.top;
                this.imgOffsetLeft = this.imgStyle.left;
            },

            calDistance (l1, l2) {
                let distance = Math.sqrt(Math.pow(Math.round(l1), 2) + Math.pow(Math.round(l2), 2));
                return distance;
            },

            determineImageFill () {
                let width = this.$el.offsetWidth ? this.$el.offsetWidth : this.width;
                let height = this.$el.offsetHeight ? this.$el.offsetHeight : this.height;

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
        -webkit-touch-callout:none;
        -webkit-user-select:none;
        -khtml-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
        -webkit-tap-highlight-color:rgba(0,0,0,0);

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

        img {
            max-width: initial;
            min-width: initial;
            -webkit-transform: translateZ(0);
            -moz-transform: translateZ(0);
            -ms-transform: translateZ(0);
            -o-transform: translateZ(0);
            transform: translateZ(0);
        }
    }
</style>