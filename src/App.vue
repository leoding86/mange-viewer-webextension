<template>
    <div id="app" class="container-fluid">
        <div class="row" style="height:400px">
            <comic-slider :datasets="galleryDatasets"></comic-slider>
        </div>

<!--         <div class="row">
            <button @click="changeGallerySrc">Init gallery</button>
            <div class="col-md-12" style="width: 1000px;height: 400px; background: #ff0000">
                <gallery :src-data="gallerySrc"></gallery>
            </div>
            <div class="col-md-12">
                <form action="#">
                    <input-field v-model="username"
                                 label="username" rule="require"></input-field>
                    <input-field v-model="password"
                                 label="password"
                                 type="password" rule="require"></input-field>
                    <input-field v-model="number"
                                 label="number"
                                 :rule="['number']"></input-field>
                    <input-field v-model="email"
                                 label="Email"
                                 :rule="['email']"></input-field>
                    <input-field v-model="email"
                                 label="Email"
                                 size="large"
                                 styleName="a"
                                 :rule="['email']"></input-field>
                    <input-field v-model="email"
                                 label="Email"
                                 size="small"
                                 :rule="['email']"></input-field>
                    <input-field v-model="custom"
                                 styleName="a"
                                 label="Custom"
                                 size="small"
                                 :rule="[customRule, customRule2]"></input-field>
                    <select-field v-model="selectValue"
                                  label="Selector"
                                  name="select"
                                  :options="options"></select-field>
                    {{selectValue}}
                    <context-select-field v-model="contextSelectValue"
                                          ref="contextSelector"
                                          label="Context Selector"
                                          name="context_select"
                                          :options="contextOptions"></context-select-field>
                    {{contextSelectValue}}
                </form>
                <button @click="changeContextSelectValue">Change contextSelectValue</button>
                <button @click="changeEmailValue">Change EmailValue</button>
            </div>
        </div> -->
    </div>
</template>

<script>
    import 'bootstrap/dist/css/bootstrap.css';
    import InputField from './components/InputField.vue';
    import SelectField from './components/SelectField.vue';
    import Gallery from './components/Gallery.vue';

    export default {
        components: {
            'input-field'         : InputField,
            'select-field'        : SelectField,
            'context-select-field': require('./components/ContextSelectField.vue'),
            'gallery'             : Gallery,
            'comic-slider'      : require('./components/ComicSlider.vue')
        },

        name: 'app',

        data () {
            return {
                msg: 'Welcome to Your Vue.js App',
                username: null,
                password: null,
                number: null,
                email: null,
                custom: '123',

                selectValue: 1,
                contextSelectValue: [1],

                options: [
                    { name: 'option1', value: 1 },
                    { name: 'option2', value: 2 },
                    { name: 'option3', value: 3 },
                    { name: 'option3', value: 4 },
                    { name: 'option3', value: 5 },
                    { name: 'option3', value: 6 },
                    { name: 'option3', value: 7 },
                    { name: 'option3', value: 8 },
                    { name: 'option3', value: 9 },
                    { name: 'option3', value: 10 },
                    { name: 'option3', value: 11 },
                    { name: 'option3', value: 12 }
                ],

                contextOptions: [
                    { name: 'coption1', value: 1, options: [
                        { name: 'coption10', value: 10 },
                        { name: 'coption11', value: 11, options: [
                            { name: 'coption100', value: 100 },
                            { name: 'coption101', value: 101 }
                        ] }
                    ] },
                    { name: 'coption2', value: 2 },
                    { name: 'coption3', value: 3 },
                    { name: 'coption4', value: 4 },
                    { name: 'coption5', value: 5 },
                ],

                customRule (val) {
                    return /^abc/i.test(val);
                },

                customRule2 (val) {
                    return /xyz$/i.test(val);
                },

                gallerySrc: 'https://vuejs.org/images/logo.png',
                pics: [
                    'https://vuejs.org/images/logo.png',
                    'https://developer.cdn.mozilla.net/static/img/logo_sprite.7d36c4a1422b.svg'
                ],
                picIndex: 0,

                galleryDatasets: [
                    'https://vuejs.org/images/logo.png',
                    'https://developer.cdn.mozilla.net/static/img/logo_sprite.7d36c4a1422b.svg',
                    'https://vuejs.org/images/logo.png',
                    'https://developer.cdn.mozilla.net/static/img/logo_sprite.7d36c4a1422b.svg',
                    'https://vuejs.org/images/logo.png',
                    'https://developer.cdn.mozilla.net/static/img/logo_sprite.7d36c4a1422b.svg',
                    'https://vuejs.org/images/logo.png',
                    'https://developer.cdn.mozilla.net/static/img/logo_sprite.7d36c4a1422b.svg'
                ]
            }
        },

        methods: {
            changeContextSelectValue () {
                this.$refs.contextSelector.init([1]);
            },
            changeEmailValue () {
                this.email = '123123';
            },

            changeGallerySrc () {
                this.gallerySrc = this.pics[this.picIndex = (this.picIndex == 0 ? 1 : 0)];
            }
        }
    }
</script>