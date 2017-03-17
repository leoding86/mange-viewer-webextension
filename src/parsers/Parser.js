import { _ua } from '../modules/common';

class Parser {

    constructor (url, siteurl, sitelogo, resOrigin) {
        this.url = url;
        this.siteurl = siteurl;
        this.sitelogo = sitelogo;
        this.resOrigin = resOrigin;
        this.totalPage = 0;
        this.PROCESSING = 1;
        this.COMPLETED = 2;
        this.datasets = { };

        // 修改请求头信息
        this.webRequestModifyHeader();
    }

    webRequestModifyHeader () {
        let _this = this;
        chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
            details.requestHeaders.push({
                name: "Referer",
                value: _this.geturl()
            }, {
                name: "User-Agent",
                value: _ua
            });
            let headers = details.requestHeaders;
            return { requestHeaders: headers };
        }, { urls: _this.resOrigin }, [ 'requestHeaders', 'blocking' ]);
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