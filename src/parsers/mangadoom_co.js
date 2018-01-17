import * as Common from '../modules/common';
import _ from '../modules/_';
import BaseParser from './Parser';

class Parser extends BaseParser {

    constructor (url) {
        super('mangadoom_co', url);
        return this.init();
    }

    init () {
        this.url = this.pattern.exec(this.url)[0];
        this.magic = new Common.Magic();
        this.datasets = this.magic.getVar('images', 'object');

        this.datasets.map((item) => {
            return item.url;
        });

        return new Promise((resolve, reject) => {
            this.totalPage = this.datasets.length;
            this.createHistoryInstance();
            resolve(this);
        });
    }

    getLink (page) {
        return page ? [this.mroot, page].join('/') : this.mroot;
    }

    getImgSrc (page, callback, context) {
        callback.call(context, page, this.datasets[page - 1].url);
    }

}

export default Parser;