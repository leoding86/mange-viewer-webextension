import { _ua, _r } from '../modules/common';

class Parser {

    constructor (name, url) {
        this.name = name;
        this.link = null;
        this.title = '';
        this.totalPage = 0;
        this.PROCESSING = 1;
        this.COMPLETED = 2;
        this.datasets = [];

        this.siteConfig = _r[this.name];

        this.pattern = this.siteConfig.pattern;
        this.siteurl = this.siteConfig.site;
        this.icon = this.siteConfig.icon;
        this.sitelogo = this.siteConfig.logo;
        this.resOrigin = this.siteConfig.origins;

        let matches = this.pattern.exec(url);
        this.mroot = matches[this.siteConfig.groups.mroot];
        this.url = matches[this.siteConfig.groups.url];
        this.id = matches[this.siteConfig.groups.id];
        this.chapter = matches[this.siteConfig.groups.chapter];
        this.volume = matches[this.siteConfig.groups.volume];

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

    getId () {
        return this.id;
    }

    getIcon () {
        return this.icon;
    }

    getChapter () {
        return this.chapter;
    }

    getVolume () {
        return this.volume;
    }

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