let DebugMixin = {
    props: {
        debugEventBus: {
            type: null,
            default: null
        }
    },

    methods: {
        debug (text) {
            if (this.debugEventBus) {
                this.debugEventBus.$emit('debug', text);
            }
        }
    }
};

export default DebugMixin;