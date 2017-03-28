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
                            <input type="text" class="form-control" placeholder="Search history">
                        </div>
                    </div>
                </div>
                <div class="row content-row">
                    <div class="col-xs-12">
                        <button type="button" class="btn btn-sm" @click="selectAllHandler">Select All</button>
                        <button type="button" class="btn btn-sm" @click="clearAllHandler">Clear</button>
                        <table class="records-table table table-bordered table-condensed table-hover">
                            <tbody>
                                <tr v-for="dataset in datasets"
                                    @mouseenter="recordMouseenterHandler"
                                    @mouseleave="recordMouseleaveHandler"
                                    @click="recordClickHandler(dataset)"
                                    :class="{'selected': dataset.__selected}">
                                    <td>
                                        <span class="plain">{{dataset.toString()}}</span>
                                        <div class="actions">
                                            <button type="button" class="btn"><span class="glyphicon glyphicon-new-window"></span></button>
                                            <button type="button" class="btn"><span class="glyphicon glyphicon-remove"></span></button>
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

    export default {
        name: 'app',

        data () {
            return {
                datasets: [],
                selectedDatasets: []
            }
        },

        watch: {
            selectedDatasets (val) {
                console.log(val);
            }
        },

        mounted () {
            this.datasets = [
                {
                    name: 1234567,
                    value: 1,
                    toString () { return this.name }
                }, {
                    name: 321,
                    value: 1,
                    toString () { return this.name }
                }, {
                    name: 'asddf',
                    value: 1,
                    toString () { return this.name }
                },
            ];

            this.datasets.forEach((dataset) => {
                Vue.set(dataset, '__selected', false);
            });

            this.selectedDatasets = [];
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

                if (dataset.__selected) {
                    this.selectedDatasets = this.selectedDatasets.concat([dataset]);
                } else {
                    this.selectedDatasets.splice(this.selectedDatasets.indexOf(dataset), 1);
                }
            },

            selectAllHandler () {
                this.datasets.forEach((dataset) => {
                    dataset.__selected = true;
                });

                this.selectedDatasets = [].concat(this.datasets);
            },

            clearAllHandler () {
                this.datasets.forEach((dataset) => {
                    dataset.__selected = false;
                });

                this.selectedDatasets = [];
            }
        }
    }
</script>

<style lang="sass">
    body {
        background: #f7f7f7 !important;
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
                    background: #afe1ff !important;
                }
            }

            td {
                .plain {
                    padding-left: 10px;
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