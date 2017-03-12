<template>
    <div class="context-select-field form-group">
        <select-field v-model="thisValue"
                      :label="label"
                      :name="name + '[]'"
                      :options="options"></select-field>
        <context-select-field v-if="childrenOptions"
                              v-model="childValue"
                              :name="name"
                              :options="childrenOptions"></context-select-field>
    </div>
</template>

<script>
    import SelectField from './SelectField.vue';

    export default {
        components: {
            'select-field': SelectField
        },

        name: 'context-select-field',

        props: {
            value: { Array, Object },
            label: {
                type: String,
                default: null
            },
            name: String,
            options: {
                type: Array,
                required: true
            }
        },

        data () {
            return {
                thisValue: null,
                childValue: []
            }
        },

        computed: {
            childrenOptions () {
                for (let i = 0, l = this.options.length; i < l; i++) {
                    if (
                        this.options[i].value == this.thisValue &&
                        this.options[i].options && this.options[i].options.length > 0
                    ) {
                        return this.options[i].options;
                    }
                }
                this.childValue = [];
                return null;
            }
        },

        watch: {
            thisValue (val) {
                this.$emit('input', [val].concat(this.childValue));
            },

            childValue (val) {
                this.$emit('input', [this.thisValue].concat(val));
            }
        },

        mounted () {
            this.init(this.value);
        },

        methods: {
            init (val) {
                this.thisValue = val.length > 0 ? val.slice(0, 1).toString() : null;
                this.childValue = val.length > 1 ? val.slice(1) : [];
            }
        }
    }
</script>