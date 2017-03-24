import * as Common from '../modules/common';
import _ from '../modules/_';
import BaseParser from './Parser';

class Parser extends BaseParser {

    constructor (url) {
        super(
            'readcomiconline_to',
            url,
            'http://www.readcomiconline.to',
            'http://readcomiconline.to/Content/images/logo.png',
            ['*://*.readcomiconline.to/*']
        );

        return this.init();
    }

    init () {
        return new Promise((resolve, reject) => {
            let magic = new Common.Magic();
            this.datasets = magic.getVar('lstImages', 'object');
            this.totalPage = this.datasets.length;
            resolve(this);
        });
    }

    // getDocument(url, resolve, reject) {
    //     let _this = this;
    //     let xhr = new XMLHttpRequest();
    //     xhr.open('GET', url);
    //     xhr.onload = function () {
    //         if (xhr.responseURL.indexOf('Special/AreYouHuman') > -1) {
    //             reject(_('check_issue'));
    //         }

    //         if ((xhr.status + "").indexOf("5") == 0) {
    //             reject(_('refresh_target_page'));
    //         } else {
    //             _this.parserDocument(xhr.responseText);
    //             resolve(_this);
    //         }
    //     }
    //     xhr.onerror = function (e) {
    //         reject(e);
    //     }
    //     xhr.send(null);
    // }

    // parserDocument (responseText) {
    //     let reg = /lstImages\.push\("([^()]+)"\)/ig
    //     let result;
    //     while ((result = reg.exec(responseText)) !== null) {
    //         this.datasets.push(result[1]);
    //     }
    // }

    getImgSrc (page, callback, context) {
        callback.call(context, page, this.datasets[page - 1]);
    }
}

export { Parser }