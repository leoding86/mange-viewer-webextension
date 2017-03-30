<template>
    <div class="container-fluid">
        <div class="row title-row">
            <div class="col-xs-12">
                <div class="input-group search-input-group">
                    <span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>
                    <input type="text" class="form-control" :placeholder="_('search_history')" v-model="keywords">
                </div>
            </div>
        </div>
        <div class="row content-row">
            <div class="col-xs-12">
                <div class="alert alert-warning" role="alert"
                     v-if="!hasSyncSupport">{{_('sync_support_notice')}}</div>
                <div class="notice">
                    <p>{{historyRecordsLimitation}}</p>
                    <div class="progress" v-if="hasGetBytesInUseSupport">
                        <div class="progress-bar" role="progressbar"
                             aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"
                             style="min-width: 2em"
                             :style="{ width: memoryPercent + '%' }">{{memoryPercent}}%</div>
                    </div>
                </div>
                <button type="button" class="btn btn-sm btn-primary" @click="selectAllHandler">{{_('select_all')}}</button>
                <button type="button" class="btn btn-sm btn-primary" @click="clearAllHandler">{{_('unselect_all')}}</button>
                <span v-if="haveDatasetsSelected">
                    <button type="button" class="btn btn-sm btn-danger" @click="deleteSelectedRecords">{{_('delete')}}</button>
                </span>
                <div class="form-inline" style="float:right;">
                    <select v-model="storageType" class="form-control input-sm" style="font-size: 12px;">
                        <option value="1">{{_('local_history')}}</option>
                        <option value="2" v-if="hasSyncSupport">{{_('sync_history')}}</option>
                    </select>
                </div>
                <table v-show="datasets.length > 0" class="records-table table table-bordered table-condensed table-hover">
                    <tbody>
                        <tr v-for="dataset in datasets"
                            v-show="matchKeywords(dataset.title)"
                            @mouseenter="recordMouseenterHandler"
                            @mouseleave="recordMouseleaveHandler"
                            @click="recordClickHandler(dataset)"
                            :class="{'selected': dataset.__selected}">
                            <td>
                                <span class="plain">{{getDateStr(dataset.lastVisited)}}</span>
                                <span class="plain">{{dataset.title}}</span>
                                <span class="plain">Pg.{{dataset.page}}</span>
                                <span class="plain note">{{getDomain(dataset.link)}}</span>
                                <div class="actions">
                                    <button type="button" class="btn"
                                            @click="openRecord(dataset, $event)"><span class="glyphicon glyphicon-new-window"></span></button>
                                    <button type="button" class="btn"
                                            @click="deleteRecord(dataset, $event)"><span class="glyphicon glyphicon-remove"></span></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import moment from 'moment';
    import storage from './modules/storage';
    import _ from './modules/_';

    export default {
        name: 'app',

        data () {
            return {
                datasets: [],
                keywords: '',
                storageType: null,
                memoryPercent: 0
            }
        },

        computed: {
            haveDatasetsSelected () {
                for (let i in this.datasets) {
                    if (this.datasets[i].__selected) {
                        return true;
                    }
                }
                return false;
            },

            historyRecordsLimitation () {
                if (this.storageType == 1) {
                    if (storage.hasGetBytesInUseLocalSupport()) {
                        return this._('local_history_storage_in_used');
                    } else {
                        return this._('local_history_storage_in_used') + ': ' + this.datasets.length + ' / 1000';
                    }
                } else {
                    return this._('sync_history_storage_in_used');
                }
            },

            hasSyncSupport () {
                return storage.hasSyncSupport();
            },

            hasGetBytesInUseSupport () {
                return storage.hasGetBytesInUseLocalSupport();
            }
        },

        watch: {
            storageType (val) {
                this.updateHistoryStorageUsage(val);

                if (val == 1) {
                    storage.getLocal('histories', (items) => {
                        if (!chrome.runtime.lastError) {
                            this.datasets = items.histories;

                            if (!this.datasets) {
                                this.datasets = [];
                            }

                            this.datasets.forEach((dataset) => {
                                Vue.set(dataset, '__selected', false);
                            });
                        } else {
                            alert(chrome.runtime.lastError);
                        }
                    });
                } else if (val == 2) {
                    storage.get('histories', (items) => {
                        if (!chrome.runtime.lastError) {
                            this.datasets = items.histories;

                            if (!this.datasets) {
                                this.datasets = [];
                            }

                            this.datasets.forEach((dataset) => {
                                Vue.set(dataset, '__selected', false);
                            });
                        } else {
                            alert(chrome.runtime.lastError);
                        }
                    });
                }
            }
        },

        mounted () {
            this.storageType = 1;
        },

        methods: {
            recordMouseenterHandler (e) {
                let buttons = e.target.querySelectorAll('button');
                buttons.forEach((button) => {
                    button.style.visibility = 'visible';
                });
            },

            recordMouseleaveHandler (e) {
                let buttons = e.target.querySelectorAll('button');
                buttons.forEach((button) => {
                    button.style.visibility = 'hidden';
                });
            },

            recordClickHandler (dataset) {
                dataset.__selected = !dataset.__selected;
            },

            selectAllHandler () {
                this.datasets.forEach((dataset) => {
                    dataset.__selected = true;
                });
            },

            clearAllHandler () {
                this.datasets.forEach((dataset) => {
                    dataset.__selected = false;
                });
            },

            deleteRecord (dataset, e) {
                e.stopPropagation();
                let index = this.datasets.indexOf(dataset);

                if (index > -1) {
                    this.datasets.splice(index, 1);
                }

                this.saveHistoryEntries(this.datasets);
            },

            deleteSelectedRecords () {
                let deletedIndex = [];

                this.datasets.forEach((dataset) => {
                    if (dataset.__selected) {
                        let index = this.datasets.indexOf(dataset);

                        if (index > -1) {
                            deletedIndex.push(index);
                        }
                    }
                });

                let length = this.datasets.length;

                deletedIndex.sort().forEach((i) => {
                    this.datasets.splice(i - length, 1);
                });

                this.saveHistoryEntries(this.datasets);
            },

            openRecord (dataset, e) {
                e.stopPropagation();
                // console.log(dataset);
                window.location.href = dataset.link;
            },

            matchKeywords (title) {
                if (!this.keywords) {
                    return true;
                }

                if (title.toLowerCase().indexOf(this.keywords) > -1) {
                    return true;
                }

                return false;
            },

            getDateStr (val) {
                return moment(val).format('YYYY/MM/DD HH:mm:ss');
            },

            getDomain (link) {
                let pattern = /^https?:\/{2}((?:w{3}\.)?[^\/]+?)\//;
                let match = pattern.exec(link);
                return match[1];
            },

            saveHistoryEntries () {
                let datasets = [].concat(this.datasets);
                datasets.map((dataset) => {
                    delete dataset.__selected;
                });

                if (this.storageType == 1) {
                    storage.setLocal({'histories': datasets}, () => {
                        if (chrome.runtime.lastError) {
                            alert(chrome.runtime.lastError);
                        }
                    });
                } else if (this.storageType == 2) {
                    storage.set({'histories': datasets}, () => {
                        if (chrome.runtime.lastError) {
                            alert(chrome.runtime.lastError);
                        }
                    });
                }

                this.updateHistoryStorageUsage(this.storageType);
            },

            updateHistoryStorageUsage (type) {
                if (type == 1) {
                    if (storage.hasGetBytesInUseLocalSupport()) {
                        storage.getBytesInUseLocal('histories', (bytes) => {
                            this.memoryPercent = Math.round(bytes / storage.LOCAL_QUOTA_BYTES * 100);
                        });
                    }
                } else if (type == 2) {
                    if (storage.hasGetBytesInUseSyncSupport()) {
                        storage.getBytesInUse('histories', (bytes) => {
                            this.memoryPercent = Math.round(bytes / storage.QUOTA_BYTES_PER_ITEM() * 100);
                        });
                    }
                }
            },

            _ (str) {
                return _(str);
            }
        }
    }
</script>

<style lang="sass">

    .main-col {
        height: 100%;
        margin-left: 220px;
        overflow-y: auto;

        .title-row {
            padding: 15px 0;

            .search-input-group {
                span {
                    border-radius: 0;
                    background: #2c7767;
                    border: none;
                    color: #fff;
                }

                input {
                    border-radius: 0;
                    background: #2c7767;
                    border: none;
                    color: #fff;

                    &:focus {
                        box-shadow: none;
                    }
                }
            }

            h2 {
                margin: 10px 0;
                color: #fff;
            }
        }

        .content-row {
            padding: 15px 0;

            .notice {
                margin: 10px 0;
                p {
                    font-size: 12px;
                    color: #666;
                }
            }
        }

        .records-table {
            margin-top: 10px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);

            tr {
                background: #fff;
                transition: all 0.2s;

                button {
                    padding: 0 3px;
                    background: #fff;
                    visibility: hidden;
                }

                &.selected {
                    background: #3367d6 !important;

                    .plain {
                        color: #fff;
                    }
                }
            }

            td {
                padding-left: 10px;

                .plain {
                    padding-right: 10px;
                    font-size: 14px;
                }

                .note {
                    font-size: 12px;
                    color: #ccc;
                }
            
                .checkbox {
                    margin: 0;
                    margin-left: 5px;
                }

                .actions {
                    float: right;
                }
            }
        }
    }
</style>