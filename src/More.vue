<template>
    <div id="app">
        <div class="side-col">
            <div class="container-fluid">
                <div class="col-xs-12">
                    side
                </div>
            </div>
        </div>
        <div class="main-col">
            <div class="container-fluid">
                <div class="row title-row">
                    <div class="col-xs-12">
                        <div class="input-group search-input-group">
                            <span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>
                            <input type="text" class="form-control" placeholder="Search history" v-model="keywords">
                        </div>
                    </div>
                </div>
                <div class="row content-row">
                    <div class="col-xs-12">
                        <button type="button" class="btn btn-sm btn-primary" @click="selectAllHandler">Select All</button>
                        <button type="button" class="btn btn-sm btn-primary" @click="clearAllHandler">Clear</button>
                        <span v-if="haveDatasetsSelected">
                            <button type="button" class="btn btn-sm btn-danger" @click="deleteSelectedRecords">Delete</button>
                        </span>
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
                                        <span class="plain">Vol.{{dataset.volume ? dataset.volume : 'n/a'}}</span>
                                        <span class="plain">Ch.{{dataset.chapter}}</span>
                                        <span class="plain">Pg.{{dataset.page}}</span>
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
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import moment from 'moment';
    import storage from './modules/storage';

    export default {
        name: 'app',

        data () {
            return {
                datasets: [],
                keywords: ''
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
            }
        },

        mounted () {
            storage.get('histories', (items) => {
                if (!chrome.runtime.lastError) {
                    this.datasets = items.histories;
                    this.datasets.forEach((dataset) => {
                        Vue.set(dataset, '__selected', false);
                    });
                } else {
                    alert(chrome.runtime.lastError);
                }
            });
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

                this.saveHistory(this.datasets);
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

                this.saveHistory(this.datasets);
            },

            openRecord (dataset, e) {
                e.stopPropagation();
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

            saveHistory () {
                let datasets = [].concat(this.datasets);
                datasets.map((dataset) => {
                    delete dataset.__selected;
                });
                storage.set({'histories': datasets}, () => {
                    if (chrome.runtime.lastError) {
                        alert(chrome.runtime.lastError);
                    }
                });
            }
        }
    }
</script>

<style lang="sass">
    body {
        background: #efefef !important;
    }

    .side-col {
        position: fixed;
        width: 220px;
        height: 100%;
        background: #fff;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }

    .main-col {
        height: 100%;
        margin-left: 220px;
        overflow-y: auto;

        .title-row {
            padding: 15px 0;
            background: #000;

            .search-input-group {
                span {
                    border-radius: 0;
                    background: #666;
                    border: none;
                    color: #fff;
                }

                input {
                    border-radius: 0;
                    background: #666;
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
                .plain {
                    padding-left: 10px;
                    font-size: 14px;
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