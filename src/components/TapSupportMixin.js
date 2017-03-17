let TapEventMixin = {
    data () {
        return {
            $_target: null,
            _touchtimeout: null,
            _supported: false,
            _pointMoved: false,
            _evt: null
        }
    },

    methods: {
        addTapSupport (target) {
            if (this._supported === true)
                return;

            this._touchtimeout = null;
            this._supported = true;
            this._pointMoved = false;
            this.$_target = target;
            this.$_target.addEventListener('touchstart', this.componentTouchstartHandler);
            this.$_target.addEventListener('touchmove', this.componentTouchmoveHandler);
        },

        removeTapSupport () {
            if (this.$_target) {
                this.$_target.removeEventListener('touchstart', this.componentTouchstartHandler);
                this.$_target.removeEventListener('touchmove', this.componentTouchmoveHandler);
                this.$_target.removeEventListener('touchend', this.componentTouchendHandler);
                this._supported = false;
            }
        },

        componentTouchstartHandler (evt) {
            this._pointMoved = false;
            this._evt = evt;
            this.$_target.addEventListener('touchend', this.componentTouchendHandler);
        },

        componentTouchmoveHandler (evt) {
            console.log(this);
            this._pointMoved = true;
            this._touchtimeout = null;
        },

        componentTouchendHandler (evt) {
            this.$_target.removeEventListener('touchend', this.componentTouchendHandler);
            if (this._touchtimeout === null) {
                if (!this._pointMoved) {
                    this._touchtimeout = setTimeout(() => {
                        this._touchtimeout = null;
                        if (!evt.cancelBubble) {
                            this.$emit('tap', this._evt);
                        }
                    }, 300);
                } else {
                    clearTimeout(this._touchtimeout);
                    this._touchtimeout = null;
                }
            } else {
                clearTimeout(this._touchtimeout);
                this._touchtimeout = null;
                if (!evt.cancelBubble) {
                    this.$emit('dbtap', this._evt);
                }
            }
        }
    }
}

export default TapEventMixin;