<template>
    <div class="container-fluid others-page">
        <div class="row title-row">
            <div class="col-xs-12">
                <h2>{{_('others')}}</h2>
            </div>
        </div>
        <div class="row content-row">
            <div class="col-xs-12">
                <div class="section">
                    <h4>{{_('storage')}}</h4>
                    <div v-if="hasSyncSupport">
                    <h5>{{_('sync_memory_in_used')}}</h5>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar"
                             aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"
                             style="min-width: 2em"
                             :style="{ width: syncMemoryPercent + '%' }">{{syncMemoryPercent}}%</div>
                    </div>
                    <button type="button" class="btn btn-xs btn-danger" role="button"
                            @click="clearSyncData">{{_('clear')}}</button>
                    </div>
                    <h5 v-if="hasGetBytesInUseLocalSupport">{{_('local_memory_in_used')}}</h5>
                    <h5 v-else>{{_('clear_local_memory')}}</h5>
                    <div class="progress" v-if="hasGetBytesInUseLocalSupport">
                        <div class="progress-bar" role="progressbar"
                             aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"
                             style="min-width: 2em"
                             :style="{ width: localMemoryPercent + '%' }">{{localMemoryPercent}}%</div>
                    </div>
                    <button type="button" class="btn btn-xs btn-danger" role="button"
                            @click="clearLocalData">{{_('clear')}}</button>
                </div>
                <div class="section">
                    <h4>{{_('settings')}}</h4>
                    <div class="section-content">
                        <div class="form-group">
                            <label for="gallery_init_zoom">{{_('init_zoom_level')}}</label>
                            <select name="gallery_init_zoom" id="gallery_init_zoom" class="form-control"
                                    v-model="galleryInitZoom">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="gallery_zoom_mode">{{_('gallery_zoom_mode')}}<span class="help-block inline-help-block">{{galleryZoomModeHelpeText}}</span></label>
                            <select name="gallery_zoom_mode" id="gallery_zoom_mode" class="form-control"
                                    v-model="galleryZoomMode">
                                <option value="1">{{_('gallery_zoom_mode_type1')}}</option>
                                <option value="2">{{_('gallery_zoom_mode_type2')}}</option>
                            </select>
                            
                        </div>
                    </div>
                </div>
                <div class="section">
                    <h4>{{_('supported_sites')}}</h4>
                    <div class="section-content">
                        <ul>
                            <li>mangapark.me</li>
                            <li>mangadoom.co</li>
                            <li>kissmanga.com</li>
                            <li>eatmanga.tv</li>
                            <li>readms.tv</li>
                            <li>readms.net</li>
                            <li>mangastream.com</li>
                            <li>mangapanda.com</li>
                            <li>readcomiconline.to</li>
                            <li>readcomics.tv</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import storage from './modules/storage';
    import config from './modules/config';
    import _ from './modules/_';

    export default {
        name: 'Other',

        data () {
            return {
                syncMemoryPercent: 0,
                localMemoryPercent: 0,
                galleryZoomMode: 0,
                galleryInitZoom: 1
            }
        },

        computed: {
            hasSyncSupport () {
                return storage.hasSyncSupport();
            },

            hasGetBytesInUseLocalSupport () {
                return storage.hasGetBytesInUseLocalSupport();
            },

            galleryZoomModeHelpeText () {
                config.set('gallery_zoom_mode', this.galleryZoomMode, (err) => {
                    window._cvrContainer.config['gallery_zoom_mode'] = this.galleryZoomMode;
                });
                return _('gallery_zoom_mode_type' + this.galleryZoomMode + '_help_text');
            }
        },

        watch: {
            galleryInitZoom (val) {
                config.set('init_zoom_level', val, (err) => {
                    window._cvrContainer.config['init_zoom_level'] = val;
                });
            }
        },

        mounted () {
            this.galleryZoomMode = window._cvrContainer.config['gallery_zoom_mode'];
            this.galleryInitZoom = window._cvrContainer.config['init_zoom_level'];

            if (storage.hasSyncSupport()) {
                storage.getBytesInUse(null, (bytesInUse) => {
                    this.syncMemoryPercent = Math.round(bytesInUse / storage.SYNC_QUOTA_BYTES() * 100);
                });
            }

            if (storage.hasGetBytesInUseLocalSupport()) {
                storage.getBytesInUseLocal(null, (bytesInUse) => {
                    this.localMemoryPercent = Math.round(bytesInUse / storage.LOCAL_QUOTA_BYTES * 100);
                });
            }
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
            },

            _ (string) {
                return _(string);
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
        padding-bottom: 20px;

        h4 {
            padding-bottom: 10px;
            border-bottom: 1px solid #ccc;
        }

        ul {
            padding-left: 0;
        }

        li {
            list-style: none;
            font-size: 12px;
            color: #666;
        }
    }

    .progress {
        margin-bottom: 5px;
    }
}
</style>