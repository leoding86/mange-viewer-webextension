<template>
    <div class="container-fluid others-page" v-if="ready">
        <div class="row title-row">
            <div class="col-xs-12">
                <h2>{{_('subscribe')}}</h2>
            </div>
        </div>
        <div class="subscribe-actions-wrapper">
            <button type="button" class="btn btn-sm btn-primary"
                    @click="syncNowClickHandler">{{syncNotice}}</button>
        </div>
        <div class="subscribe-wrapper">
            <div v-for="subscribe in subscribeInfos"
                 class="subscribe"
                 @mouseenter="subscribeMouseenterHandler($event)"
                 @mouseleave="subscribeMouseleaveHandler($event)">
                <div class="row-info" @click="subscribeClickHandler(subscribe)">
                    <div class="title"><strong>{{subscribe.title}}</strong> <span class="label label-primary">{{_r[subscribe.parserName].parser}}</span> <span class="label label-danger" v-if="subscribe.syncStatus !== 'ok'">sync failed</span></div>
                    <div class="notice" v-html="compareChapter(subscribe.lastestChapterId, subscribe.lastestSavedChapterId)"></div>
                    <div class="clearfix"></div>
                </div>
                <div class="detail">
                    <div class="lst">Lastest chapter: <a @click="navigateToLastestChapter(subscribe)">{{subscribe.lastestChapterTitle}}</a></div>
                    <div class="actions">
                        <button type="button" class="btn" title="Clear"><span class="glyphicon glyphicon-ok" @click="clearSubscribeNoticeHandler(subscribe)"></span></button>
                        <button type="button" class="btn"><span class="glyphicon glyphicon-remove" @click="deleteSubscribeHandler(subscribe)"></span></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import storage from './modules/storage';
    // import underscore from 'underscore';
    import _ from './modules/_';
    import { _r } from './modules/common';
    import Message from './modules/Message';
    import Subscribe from 'models/Subscribe';
    import Debug from './components/CvrDebugEvent';

    export default {
        name: "Subscribe",

        data () {
            return {
                ready: false,
                subscribes: null,
                subscribeInfos: [],
                _r: null,
                parserInstances: {},
                syncing: false,
                syncNotice: null,

                debugModeActive: window._cvrContainer.config['debug_mode']
            }
        },

        mounted () {
            this._r = _r;
            this.syncNotice = _('sync_now');
            this.subscribeModel = new Subscribe();
            this.subscribeModel.init().then((subscribeInfos) => {
                subscribeInfos.sort((a, b) => {
                    if (a.parserName < b.parserName) return 1;
                    if (b.parserName < a.parserName) return -1;
                    return 0;
                });

                let temp = {};

                subscribeInfos.forEach((item) => {
                    item.syncStatus = 'ok';
                    temp[item.subscribeId] = item;
                });

                this.subscribeInfos = temp;
                this.ready = true;
            });

            chrome.runtime.onMessage.addListener(this.messageHandler);
Debug.emit('Subscribe page has been created');
        },

        beforeDestroy () {
            chrome.runtime.onMessage.removeListener(this.messageHandler);
Debug.emit('Remove chrome runtime message listener');
        },

        methods: {
            compareChapter (lcid, lscid) {
                return lcid == lscid ? 
                    '' : '<span class="label label-danger">NEW</span>';
            },

            messageHandler (message) {
                switch (message.type) {
                    case 'sync_complete':
                        Debug.emit('Subscribe ' + message.msg.subscribeId + ' is sync completed');
                        this.subscribeInfos[message.msg.subscribeId].lastestChapterId = message.msg.lastestChapterId;
                        this.subscribeInfos[message.msg.subscribeId].lastestChapterTitle = message.msg.lastestChapterTitle;
                        this.subscribeInfos[message.msg.subscribeId].syncStatus = 'ok';
                        break;
                    case 'syncing':
                        Debug.emit('It\'s syncing');
                        alert(_('is_syncing_notice'));
                        break;
                    case 'sync_progress':
                        Debug.emit('Sync progress ' + message.msg);
                        this.syncNotice = message.msg;
                        break;
                    case 'sync_error':
                        alert(message.msg);
                        this.syncNotice = _('sync_now');
                        break;
                    case 'sync_item_error':
                        this.subscribeInfos[message.msg['subscribeId']].syncStatus = 'error';
                        break;
                    case 'sync_done':
                        Debug.emit('Sync successed');
                        this.syncNotice = _('sync_now');
                        break;
                    case 'sync_finished':
                        Debug.emit('Sync finished');
                        this.syncNotice = _('sync_now');
                        break;
                }
            },

            subscribeClickHandler (subscribe) {
                subscribe.__selected = !subscribe.__selected;
                console.log(subscribe);
            },

            subscribeMouseenterHandler (e) {
                let $actions = e.currentTarget.querySelector('.actions');
                if ($actions.style.display != 'block') {
                    $actions.style.display = 'block';
                }
            },

            subscribeMouseleaveHandler (e) {
                let $actions = e.currentTarget.querySelector('.actions');
                if ($actions.style.display != 'none') {
                    $actions.style.display = 'none';
                }
            },

            syncNowClickHandler () {
Debug.emit('Sync now');
                chrome.runtime.sendMessage((new Message('sync_now', '')));
            },

            clearSubscribeNoticeHandler (subscribe) {
                subscribe.lastestSavedChapterId = subscribe.lastestChapterId;
                subscribe.lastestSavedChapterTitle = subscribe.lastestChapterTitle
                this.subscribeModel.clearNotice(subscribe.subscribeId).then(() => {
Debug.emit('Subscribe with ID:' + subscribe.subscribeId + '\'s notice has been cleared');
                    this.subscribeModel.check();
                });
            },

            deleteSubscribeHandler (subscribe) {
                if (window.confirm(_('delete_confirm'))) {
                    this.subscribeModel.remove(subscribe.subscribeId);
                    this.subscribeInfos.forEach((info) => {
                        if (info.subscribeId == subscribe.subscribeId) {
                            this.subscribeInfos.splice(this.subscribeInfos.indexOf(info), 1);
                            this.subscribeModel.check();
Debug.emit('Subscribe with ID:' + subscribe.subscribeId + ' has been deleted');
                        } else {
Debug.emit('Cannot found subscribe with ID:' + subscribe.subscribeId);
                        }
                    });
                } else {
Debug.emit('Delete operation has been cancelled');
                }
            },

            navigateToChapter (subscribe, id) {
                if (id) {
                    this.getParser(subscribe.parserName).then((parser) => {
                        parser.id = subscribe.mangaId;
                        parser.setSubscribeInfoProperties(
                            subscribe.lastestChapterId,
                            subscribe.lastestChapterTitle,
                            subscribe.title,
                            subscribe.lastTime,
                            subscribe.extras
                        );
Debug.emit('Navigate to ' + parser.getChapterURL(id));
                        window.location.href = parser.getChapterURL(id)
                    }, (err) => {

                    });
                }
            },

            navigateToLastestChapter (subscribe) {
                this.navigateToChapter(subscribe, subscribe.lastestChapterId);
            },

            navigateToLastestReadedChapter (subscribe) {
                this.navigateToChapter(subscribe, subscribe.lastestReadedChapterId);
            },

            getParser (parserName) {
                return new Promise((resolve, reject) => {
                    if (this.parserInstances[parserName]) {
                        resolve(this.parserInstances[parserName]);
                    }

                    let parser = require('./subscribe_parsers/' + parserName + '.js');
                    (new parser.default()).then((instance) => {
                        this.parserInstances[parserName] = instance;
                        resolve(instance);
                    });
                });
            },

            _ (string) {
                return _(string);
            }
        }
    }
</script>

<style lang="sass">
    .subscribe-actions-wrapper {
        margin-top: 20px;
    }

    .subscribe-wrapper {
        margin-top: 10px;
        box-shadow: 0 0 3px #f7f7f7;
    }

    .subscribe {
        position: relative;
        margin-bottom: 5px;
        font-size: 14px;
        border: 1px solid #ddd;
        border-top-color: #ccc;
        background: #fff;

        .row-info {
            padding: 5px 8px;
            cursor: pointer;
        }

        .detail {
            padding: 5px 8px;
        }

        .title {
            width: 50%;
            float: left;

            .label {
                position: relative;
                top: -2px;
            }
        }

        .notice {
            float: right;
        }

        .detail {
            position: relative;
            border-top: 1px solid #ddd;

            a {
                cursor: pointer;
            }

            .actions {
                display: none;
                position: absolute;
                right: 3px;
                bottom: 3px;

                button {
                    padding: 0 3px;
                    background: #fff;
                }
            }
        }

        &:hover {
            box-shadow: 0 0 3px #ccc;
            border-color: #ccc;
            z-index: 999;
        }
    }
</style>