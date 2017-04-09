<template>
    <div class="container-fluid others-page" v-if="ready">
        <div class="row title-row">
            <div class="col-xs-12">
                <h2>{{_('subscribe')}}</h2>
            </div>
        </div>
        <div class="subscribe-wrapper">
            <div class="subscribe" v-for="subscribe in subscribeInfos">
                <div class="title"><strong>{{subscribe.title}}</strong></div>
                <div class="notice">{{compareChapter(subscribe.lastestChapterId, subscribe.lastestSavedChapterId)}}</div>
                <div class="clearfix"></div>
                <div class="detail">
                    <div class="lst">Lastest chapter: {{subscribe.lastestChapterTitle}}</div>
                    <div class="lrct">Last readed chapter: {{subscribe.lastestReadedChapterTitle}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import storage from './modules/storage';
    import underscore from 'underscore';
    import _ from './modules/_';

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
                this.ready = true;
            });
        },

        methods: {
            compareChapter (lcid, lscid) {
                return lcid == lscid ? 'NO' : 'YES';
            },

            parseSubscribeInfos (items) {
                for (var k in items) {
                    if (k.indexOf('subInfo_') == 0) {
                        this.subscribeInfos[k] = items[k];
                    }
                }

                underscore.sortBy(this.subscribeInfos, 'parserName');
            },

            _ (string) {
                return _(string);
            }
        }
    }
</script>

<style lang="sass">
    .subscribe-wrapper {
        margin-top: 20px;
        box-shadow: 0 0 3px #ccc;
    }

    .subscribe {
        position: relative;
        margin-top: -1px;
        padding: 5px 10px;
        font-size: 14px;
        border: 1px solid #ddd;
        border-top-color: #ccc;
        background: #fff;
        cursor: pointer;

        .title {
            width: 50%;
            float: left;
        }

        .notice {
            float: right;
        }

        .detail {
            margin: 5px -10px 0 -10px;
            padding-top: 5px;
            padding-left: 10px;
            border-top: 1px solid #ddd;
        }

        &:hover {
            box-shadow: 0 0 3px #ccc;
            border-color: #ccc;
            z-index: 999;
            background: #f5f5f5;
        }
    }
</style>