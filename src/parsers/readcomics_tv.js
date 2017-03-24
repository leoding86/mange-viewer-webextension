import * as Common from '../modules/common';
import BaseParser from './Parser';

class Parser extends BaseParser {

    constructor (url) {
        super(
            'readcomics_tv',
            url,
            'http://www.readcomics.tv',
            'http://www.readcomics.tv/images/site/front/logo4.png'
        );

        return this.init();
    }

    init () {
        return new Promise((resolve, reject) => {
            let matches = this.url.match(this.pattern);
            if (matches) {
                this.getDocument(matches[0] + '/full', resolve, reject);
            }
        });
    }

    getDocument (url, resolve, reject) {
        let _this = this;
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function () {
            _this.parserDocument(xhr.responseText);
            resolve(_this);
        }
        xhr.onerror = function (e) {
            reject(e);
        }
        xhr.send(null);
    }

    parserDocument (responseText) {
        let reg = new RegExp('<img[^\/]+src="([^"]+)"[^\/]+\/>', 'g');
        let result;
        while ((result = reg.exec(responseText)) !== null) {
            this.datasets.push(result[1]);
        }

        this.totalPage = this.datasets.length;
    }

    getImgSrc (page, callback, context) {
        callback.call(context, page, this.datasets[page - 1]);
    }

}

export { Parser }