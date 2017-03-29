import * as Common from '../modules/common';
import _ from '../modules/_';
import JSZip from 'jszip';

class Parser {

    constructor (files, openProcessCallback) {
        this.datasets = [];
        this.processCallback = openProcessCallback;
        this.totalPage = 0;
        this.files = files;
        return this.init();
    }

    init () {
        return new Promise((resolve, reject) => {
            let _this = this;

            if (this.files.length === 0) {
                reject(_('no_file_selected'));
            } else if (this.files.length === 1) {
                JSZip.loadAsync(this.files[0]).then((zip) => {

                    /* 遍历文件 */
                    let index = 0;
                    let completedCount = 0;
                    for (let filename in zip.files) {
                        let file = zip.files[filename];

                        /* 判断扩展名 */
                        if (/\.(?:jpg|jpeg|png|gif|bmp|webp)$/i.test(file.name)) {

                            /* hold position */
                            this.datasets[index] = null;

                            file.async('blob').then((function (content) {
                                _this.datasets[this.index] = {
                                    name: name,
                                    url: URL.createObjectURL(content)
                                };
                                completedCount++;
                                _this.processCallback(completedCount);

                                if (completedCount == _this.datasets.length) {
                                    resolve(_this);
                                }
                            }).bind({index: index, name: file.name}));
                            index++;
                        }
                    }

                    this.totalPage = this.datasets.length;
                }, (e) => {
                    reject(e);
                });
            } else {
                reject(_('support_one_file_only'));
            }
        });
    }

    getImgSrc (page, callback, context) {
        callback.call(context, page, this.datasets[page - 1].url);
    }

    getTotalPage () {
        return this.totalPage;
    }

    isValidIndex (index) {
        return index <= this.totalPage - 1;
    }

}

export default Parser;