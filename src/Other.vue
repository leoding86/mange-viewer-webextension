<template>
    <div class="container-fluid others-page">
        <div class="row title-row">
            <div class="col-xs-12">
                <h2>Others</h2>
            </div>
        </div>
        <div class="row content-row">
            <div class="col-xs-12">
                <div class="section" v-if="hasSyncSupport">
                    <h5>Sync memory in used</h5>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar"
                             aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"
                             style="min-width: 2em"
                             :style="{ width: syncMemoryPercent + '%' }">{{syncMemoryPercent}}%</div>
                    </div>
                    <button type="button" class="btn btn-xs btn-danger" role="button"
                            @click="clearSyncData">Clear</button>
                </div>
                <div class="section">
                    <h5>Local memory in used</h5>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar"
                             aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"
                             style="min-width: 2em"
                             :style="{ width: localMemoryPercent + '%' }">{{localMemoryPercent}}%</div>
                    </div>
                    <button type="button" class="btn btn-xs btn-danger" role="button"
                            @click="clearLocalData">Clear</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import storage from './modules/storage';

    export default {
        data () {
            return {
                syncMemoryPercent: 0,
                localMemoryPercent: 0
            }
        },

        computed: {
            hasSyncSupport () {
                return storage.hasSyncSupport();
            }
        },

        mounted () {
            if (storage.hasSyncSupport()) {
                storage.getBytesInUse(null, (bytesInUse) => {
                    this.syncMemoryPercent = Math.round(bytesInUse / storage.SYNC_QUOTA_BYTES() * 100);
                });
            }

            storage.getBytesInUseLocal(null, (bytesInUse) => {
                this.localMemoryPercent = Math.round(bytesInUse / storage.LOCAL_QUOTA_BYTES * 100);
            });
        },

        methods: {
            clearLocalData () {
                if (window.confirm('Reset settings and clear all local1 data ?')) {
                    storage.clearLocal(() => {
                        this.localMemoryPercent = 0;
                    });
                }
            },

            clearSyncData () {
                if (window.confirm('Clear all sync data ?')) {
                    storage.clear(() => {
                        this.syncMemoryPercent = 0;
                    });
                }
            }
        }
    }
</script>

<style lang="sass">
.others-page {
    .title-row {
        h2 {
            margin: 0;
        }
    }

    .section {
        margin-bottom: 20px;
    }

    .progress {
        margin-bottom: 5px;
    }
}
</style>