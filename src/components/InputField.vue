<template>
    <div :class="['input-field', 'form-group', 'has-feedback', formGroupSizeClass, noticeClass, styleClass]">
        <label for="" :class="['control-label', labelClass, labelActive]">{{label}}</label>
        <input :class="['form-control']"
               :value="value"
               @input="updateValue($event.target.value)"
               @focus="inputStats = true" @blur="inputBlurHandler" :rule="rule" :type="type" />
        <span :class="['glyphicon', glyphiconClass, 'form-control-feedback']"
              aria-hidden="true"></span>
    </div>
</template>

<script>
    export default {
        name: 'input-field',

        props: {
            value: String,
            label: String,
            size : {
                type   : String,
                default: 'default'
            },
            type: {
                type: String,
                default: 'text'
            },
            rule: {
                type: [String, Array, Function],
                default: null
            },
            styleName: {
                type: String,
                default: null
            }
        },

        data () {
            return {
                inputStats    : false,
                isValid       : null,
                noticeClass   : null,
                glyphiconClass: null,
                rules: {
                    require (val) {
                        return val ? val.length > 0 : false;
                    },
                    number (val) {
                        return /^\d+$/.test(val);
                    },
                    email (val) {
                        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(val);
                    }
                }
            }
        },

        watch: {
            isValid (val) {
                if (val === true) {
                    this.noticeClass = 'has-success';
                    this.glyphiconClass = 'glyphicon-ok';
                } else if (val === false) {
                    this.noticeClass = 'has-error';
                    this.glyphiconClass = 'glyphicon-remove';
                } else {
                    this.noticeClass = '';
                    this.glyphiconClass = '';
                }
            },

            value (val) {
                this.isValid = this.validate(val);
            }
        },

        computed: {
            formGroupSizeClass () {
                if (this.size == 'small') {
                    return 'form-group-sm';
                } else if (this.size == 'large') {
                    return 'form-group-lg';
                } else {
                    return false;
                }
            },

            labelClass () {
                return this.size;
            },

            labelActive () {
                return (this.value || this.inputStats) ? 'active' : '';
            },
            
            styleClass () {
                return this.styleName ? 'style-' + this.styleName : '';
            }
        },

        mounted () {
            this.isValid = this.validate(this.value, true);
        },

        methods: {
            updateValue (value) {
                this.$emit('input', value);
            },

            validate (value, mounted = false) {
                if (!this.rule)
                    return true;

                var rule = [];

                if (Object.prototype.toString.call(this.rule) !== '[object Array]') {
                    rule.push(this.rule);
                } else {
                    rule = this.rule;
                }

                rule = rule.map((r) => {
                    if (typeof r === 'function') {
                        return r;
                    } else if (typeof r === 'string') {
                        return r.toLowerCase();
                    }
                });

                try {
                    for (let i = 0, l = rule.length; i < l; i++) {
                        if (rule[i] == 'require' && !mounted && !this.rules['require'](value)) {
                            return false;
                        } else if (value) {
                            let validator = typeof rule[i] === 'function' ?
                                                rule[i] : this.rules[rule[i]];
                            if (!validator(value)) {
                                return false;
                            }
                        } else if (!value) {
                            return null;
                        }
                    }
                    return true;
                } catch (e) {
                    throw (e + '. Unkown rule -> ' + rule);
                }
            },

            inputBlurHandler () {
                this.inputStats = false;
                this.isValid = this.validate(this.value);
            }
        },
    }
</script>

<style lang="sass">
    .input-field {
        position: relative;
        margin-bottom: 15px;

        label {
            height: 25px;
            line-height: 25px;
            position: relative;
            margin-bottom: 0;
            z-index: 0;
            transition: transform 0.2s, font-size 0.2s;
        }

        label.default {
            transform: translateY(30px) translateX(1em);
        }

        label.large {
            transform: translateY(36px) translateX(1em);
        }

        label.small {
            transform: translateY(28px) translateX(1em);
        }

        label.active {
            font-size: 12px;
            transform: translate(0, 0);
        }

        input {
            position: relative;
            z-index: 1;
            background-color: rgba(0, 0, 0, 0);
        }
    }

    .style-a {
        input {
            border-top: none;
            border-left: none;
            border-right: none;
        }
        
        input.form-control,
        input.form-control:focus {
            box-shadow: none;
            border-radius: 0px;
        }
    }
</style>