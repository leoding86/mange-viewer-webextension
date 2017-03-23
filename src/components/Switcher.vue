<template>
    <div class="switcher-control">
        <div class="config-title"
             @click="toggleSwitch">{{configTitle}}</div>
        <div class="switch-wrapper"
             :class="{ 'status-active': active, 'status-deactive': !active }"
             @click="toggleSwitch">
            <div class="handler"
                 :class="{ 'handler-active': active, 'handler-deactive': !active }"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'switcher-control',

    props: {
        values: {
            type: Array,
            default () {
                return [0, 1];
            }
        },

        configTitle: {
            type: String,
            default: 'Untitled'
        },

        value: {
            type: null,
            default: 0
        }
    },

    data () {
        return {
            _value: 0,
            active: false
        }
    },

    watch: {
        value (val) {
            this._value = val;
            let index = this.values.indexOf(val);
            this.active = index === 0 ? false : true;
        }
    },

    mounted () {
        let index = this.values.indexOf(this.value);

        if (index === -1) {
            throw('Invalid value of switcher [' + this.value + ']');
        }

        this.active = index === 0 ? false : true;
    },

    methods: {
        toggleSwitch () {
            this.active = !this.active;
            this._value = this.values[(this.active ? 1 : 0)];
            this.$emit('input', this._value);
        }
    }
}    
</script>

<style lang="sass">
    $width: 100%;
    $height: 20px;
    $switchWrapperWidth: 40px;
    $handlerWidth: $height - 4;
    $handlerHeight: $handlerWidth;
    $handlerRadius: 9px;
    $handlerTop: ($height - $handlerWidth) / 2;
    $handlerDeactiveLeft: $handlerTop;
    $handlerActiveLeft: $switchWrapperWidth - $handlerWidth - $handlerTop;

    .switcher-control {
        width: $width;
        height: $height;
        margin: 5px auto;

        .config-title {
            font-size: 12px;
            line-height: 18px;
            float: left;
            color: #000;
            cursor: pointer;
        }

        .switch-wrapper {
            width: $switchWrapperWidth;
            height: $height;
            border-radius: 15px;
            cursor: pointer;
            position: relative;
            float: right;
            margin-left: 5px;
            transition: background 0.3s;

            .handler {
                width: $handlerWidth;
                height: $handlerHeight;
                border-radius: $handlerRadius;
                position: absolute;
                top: $handlerTop;
                box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
                background: rgb(255, 255, 255);
                transition: all 0.3s;
            }

            .handler-deactive {
                left: $handlerDeactiveLeft;
            }

            .handler-active {
                left: $handlerActiveLeft;
            }
        }

        .status-active {
            background: rgb(20, 185, 0);
        }

        .status-deactive {
            background: #ddd;
        }
    }
</style>