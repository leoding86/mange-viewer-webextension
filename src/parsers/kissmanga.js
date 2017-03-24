import * as Common from '../modules/common';
import _ from '../modules/_';
import BaseParser from './Parser';

class Parser extends BaseParser {

    constructor (url) {
        super(
            url,
            'http://kissmanga.com',
            'http://kissmanga.com/Content/images/logo.png',
            ['*://*.kissmanga.com/*']);

        return this.init();
    }

    init () {
        this.url = Common._r.kissmanga.exec(this.url)[0];
        this.magic = new Common.Magic();
        this.datasets = this.magic.getVar('lstImages', 'object');

        return new Promise((resolve, reject) => {
            this.totalPage = this.datasets.length;
            resolve(this);
        });
    }

    getImgSrc (page, callback, context) {
        callback.call(context, page, this.datasets[page - 1]);
    }

}

export { Parser };