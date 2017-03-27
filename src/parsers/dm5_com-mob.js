import * as Common from '../modules/common';
import _ from '../modules/_';
import XHR from '../modules/XHR';
import BaseParser from './Parser';

class Parser extends BaseParser {

    constructor (url) {
        super('dm5_com', url);
        this.cid = null;
        this.mid = null;
        this.uid = 0;

        return this.init();
    }

    init () {
        let _this = this;
        return new Promise((resolve, reject) => {
            _this.parseDocument(document.body.innerHTML);
            resolve(_this);
        });
    }

    parseDocument (responseText) {
        let magic = new Common.Magic();
        let images = magic.getVar('newImgs', 'object');
        console.log(images);
        /* 分析页数 */
        this.totalPage = images.length;
        this.datasets = images;
    }

    /**
     * must implemenet method
     * @return {[type]} [description]
     */
    getImgSrc (page, callback, context) {
        callback.call(context, page, this.datasets[page - 1]);
    }
}

export default Parser