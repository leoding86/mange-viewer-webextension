import { _ua, _r } from '../modules/common';

class Parser {

    constructor (name, url) {
        this.name = name;
        this.url = url;
        this.totalPage = 0;
        this.PROCESSING = 1;
        this.COMPLETED = 2;
        this.datasets = [];
        this.pattern = _r[this.name].pattern;
        this.siteurl = _r[this.name].site;
        this.sitelogo = _r[this.name].logo;
        this.resOrigin = _r[this.name].origins;

        // 修改请求头信息
        // this.webRequestModifyHeader();
    }

    // webRequestModifyHeader () {
    //     let _this = this;
    //     chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
    //         details.requestHeaders.push({
    //             name: "Referer",
    //             value: _this.geturl()
    //         }, {
    //             name: "User-Agent",
    //             value: _ua
    //         });
    //         let headers = details.requestHeaders;
    //         return { requestHeaders: headers };
    //     }, { urls: _this.resOrigin }, [ 'requestHeaders', 'blocking' ]);
    // }

    geturl () {
        return this.url;
    }

    getSiteurl () {
        return this.siteurl;
    }

    getSitelogo () {
        return this.sitelogo;
    }

    getTotalPage () {
        return this.totalPage;
    }

    isValidIndex (index) {
        return index <= this.totalPage - 1;
    }

}

export default Parser;