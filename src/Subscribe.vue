<template>
    <div v-if="ready">sub</div>
</template>

<script>
    import storage from './modules/storage';

    export default {
        name: "Subscribe",

        data () {
            return {
                ready: false,
                subscribes: null,
                subscribeInfos: {}
            }
        },

        mounted () {
            storage.get(null, (items) => {
                this.subscribes = items.subscribes;
                this.parseSubscribeInfos(items);
                console.log(this.subscribeInfos);
                this.ready = true;
            });
        },

        methods: {
            parseSubscribeInfos (items) {
                for (var k in items) {
                    if (k.indexOf('subInfo_') == 0) {
                        this.subscribeInfos[k] = items[k];
                    }
                }
            }
        }
    }
</script>