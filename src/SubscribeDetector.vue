<template>
    <div class="cvr-subscribe-wrapper">
        <div class="cvr-subscribe-btn" @click="subscribeBtnClickHandler" v-if="subscribed === false && detected">
            <span v-if="!processing">Subscribe it</span><span v-if="processing">Subscribing...</span>
        </div>
        <div class="cvr-subscribe-btn" v-if="subscribed === true && detected">
            Subscribed !
        </div>
        <div class="cvr-subscribe-btn" v-if="subscribed === null && detected">
            Something wrong
        </div>
    </div>
</template>

<script>
    export default {
        name: "SubscribeDetector",

        data () {
            return {
                detected: false,
                processing: false,
                subscribed: false,
                parser: null
            }
        },

        mounted () {
            this.parser = window._cvrContainer.parserInstance;
            this.parser.init(window.location.href);
            let subscribed = this.parser.isSubscribed();

            if (subscribed === true) {
                this.subscribed = true;
            } else if (subscribed === null) {
                this.subscribed = null;
            }

            this.detected = true;
        },

        methods: {
            subscribeBtnClickHandler (e) {
                if (this.processing) return;

                this.processing = true;

                // let parser = window._cvrContainer.parserInstance;
                // parser.init(window.location.href);

                this.parser.saveSubscribe().then((msg) => {
                    this.processing = false;
                    this.subscribed = true;
                    alert(msg);
                }, (err) => {
                    this.processing = false;
                    alert(err);
                });
            }
        }
    }
</script>

<style lang="sass">
    .cvr-subscribe-wrapper {
        position: fixed;
        bottom: 3px;
        left: 3px;
        z-index: 99999;

        .cvr-subscribe-btn {
            padding: 3px 6px;
            background: #3367d6;
            color: #fff;
            border-radius: 3px;
            box-shadow: 0 0 2px #333;

            font-weight: 700;
            font-size: 14px;

            cursor: pointer;

            &:hover {
                background: #337ab7;
            }
        }
    }
</style>