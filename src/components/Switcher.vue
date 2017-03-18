<template>
    <div class="switcher-control">
        <div class="icon-left"></div>
        <div class="switch-wrapper" @click="toggleSwitch">
            <div class="handler"
                 :class="{ 'switch-active': active, 'switch-deactive': !active }"></div>
        </div>
        <div class="icon-right"></div>
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
        }
    },

    data () {
        return {
            active: false
        }
    },

    methods: {
        toggleSwitch () {
            this.active = !this.active;
            this.$emit('switch', this.values[(this.active ? 1 : 0)]);
        }
    }
}    
</script>

<style lang="sass">
    .switcher-control {
        width: 130px;
        height: 30px;

        .icon-left,
        .icon-right {
            width: 30px;
            height: 30px;
            float: left;
        }

        .icon-right {
            margin-left: 5px;
        }

        .switch-wrapper {
            width: 60px;
            height: 30px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 15px;
            cursor: pointer;
            position: relative;
            float: left;
            margin-left: 5px;

            .handler {
                width: 22px;
                height: 22px;
                background: blue;
                border-radius: 11px;
                position: absolute;
                top: 4px;
                transition: all 0.3s;
            }

            .switch-deactive {
                left: 4px;
            }

            .switch-active {
                left: 34px;
            }
        }
    }
</style>