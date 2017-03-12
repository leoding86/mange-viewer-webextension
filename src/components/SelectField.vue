<template>
    <div class="select-field">
        <div class="form-group has-feedback">
            <label for="" v-if="label" class="control-label">{{label}}</label>
            <div class="selected-input form-control"
                 @click="selectionActive = !selectionActive">{{selectedOption.name}}</div>
            <span class="form-control-feedback" :class="['glyphicon', 'glyphicon-triangle-' + triangle]" aria-hidden="true"></span>
        </div>
        <div class="selection-wrapper row"
             :style="{ width: wrapperWidth + 'px', height: wrapperHeight + 'px' }"
             v-if="selectionActive"
             @click="selectionActive = false">
            <div class="col-xs-2 col-sm-3 col-md-4 col-lg-4"></div>
            <div class="col-xs-8 col-sm-6 col-md-4 col-lg-4">
                <div class="row">
                    <div class="col-md-12">
                        <div class="input-group" @click="searchFieldClickHandler">
                            <input class="form-control" style="border-right: 0" type="text" ref="searchForm" v-model="query">
                            <span class="input-group-addon glyphicon glyphicon-search icon-search" aria-hidden="true"></span>
                        </div>
                    </div>
                    <div class="col-md-12 options-wrapper">
                        <div class="options" :style="{ 'max-height': optionsHeight + 'px' }">
                            <div v-for="option in selectOptions" v-show="hitQuery(option)"
                                 class="option" :class="{selected: isSelected(option)}"
                                 @click="changeUpdate(option)">{{option.name}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <input :name="name" type="hidden" :value="value">
    </div>
</template>

<script>
    export default {
        name: 'select-field',

        props: {
            label: {
                type: String,
                default: null
            },

            name: {
                type: String,
                default: '',
            },

            value: {
                type: [String, Number],
                default: null
            },

            options: {
                type: Array,
                required: true
            },

            required: {
                type: Boolean,
                default: false
            },

            nullOption: {
                type: Object,
                default () {
                    return { name: '请选择', value: null};
                }
            }
        },

        data () {
            return {
                option: {},
                selectionActive: false,
                optionsHeight: 0,
                query: '',
                wrapperWidth: 0,
                wrapperHeight: 0
            }
        },

        computed: {
            triangle () {
                return this.selectionActive ? 'top' : 'bottom';
            },

            selectedOption () {
                let selectedOption = this.selectOptions[0];
                if (this.value) {
                    for (let i = 0, l = this.selectOptions.length; i < l; i++) {
                        if (this.selectOptions[i].value == this.value) {
                            selectedOption = this.selectOptions[i];
                        }
                    }
                }
                return selectedOption;
            },

            selectOptions () {
                return !this.required ?
                            [this.nullOption].concat(this.options) : this.options;
            }
        },

        watch: {
            selectionActive (val) {
                if (val) {
                    this.optionsHeight = Math.round(document.documentElement.clientHeight * 0.5);
                    this.windowResizeHandler();
                    window.addEventListener('resize', this.windowResizeHandler);
                } else {
                    window.removeEventListener('resize', this.windowResizeHandler);
                }
            }
        },

        mounted () {

        },

        methods: {
            windowResizeHandler () {
                this.wrapperWidth = document.documentElement.clientWidth + 15;
                this.wrapperHeight = document.documentElement.clientHeight;
            },

            changeUpdate (option) {
                this.$emit('input', option.value);
            },

            searchFieldClickHandler (e) {
                e.stopPropagation();
            },

            isSelected (option) {
                return option.value === this.value;
            },

            hitQuery (option) {
                return this.query ? (option.name.indexOf(this.query) > -1) : true;
            }
        }
    }
</script>

<style lang="sass">
.select-field {
    .form-group {
        position: relative;

        span.glyphicon {
        }

        label.control-label {
            font-size: 12px;
        }
    }

    .selection-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        padding-top: 5%;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;

        .icon-search {
            top: 0;
            background: #fff;
        }

        .options {
            margin-top: 10px;
            border-radius: 5px;
            overflow-x: hidden;
            background: #fff;
        }

        .option {
            padding: 5px;
            line-height: 26px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
        }

        .option:hover {
            background: #eee;
        }

        .selected {
            font-weight: 700;
        }
    }
}
</style>