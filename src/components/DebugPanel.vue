<template>
    <div class="cvr-debug-panel">
        
    </div>
</template>

<script>
    import Debug from './CvrDebugEvent';

    export default {
        name: 'debug-panel',

        mounted () {
            Debug.on((text) => {
                let date = new Date();
                text = '[' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '] ' + text;
                this.insertDebugStr(text);
            });
        },

        methods: {
            insertDebugStr (text) {
                let $text = document.createElement('div');
                $text.className = 'cvr-debug-text';
                let $p = document.createElement('p');
                $p.innerText = text;
                $text.appendChild($p);
                this.$el.insertBefore($text, this.$el.firstChild);
            }
        }
    }
</script>

<style lang="sass">
    .cvr-debug-panel {
        width: 50%;
        height: 50%;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 3px;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.6);
        overflow-y: auto;

        .cvr-debug-text {
            color: #000;
            margin: 0 3px;
            padding: 3px 0;
            border-bottom: 1px solid #fff;
        }
    }
</style>